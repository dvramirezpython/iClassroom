const express = require("express");
const router = express.Router();
var cors = require('cors')
const app = express();
const { Classroom, ClassSession, GroupSummaryResult, IndividualSummaryResult } = require('../models/sessionModels')
const { School, Area, Career, Room, Subject, Group } = require('../models/schoolModels');
const {Administrator, Student, Teacher, Supervisor, User} = require('../models/userModels');
const { ObjectID } = require("mongodb");
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

// Get all class rooms
router.get('/class_rooms', async (req, res) => {
  const class_rooms = await Classroom.find({});
  res.send(class_rooms); 
});

// Get all the classrooms that belong to a teacher
router.get('/class_roomsPerTeacher/:teacherId', async (req, res) => {
  let class_rooms = await Classroom.find({}).populate('teacher');
  class_rooms = class_rooms.filter((c) => c.teacher._id == req.params.teacherId);
  res.send(class_rooms); 
});

// Get a single class room
router.get('/class_room/:id', async (req, res) => {
  const class_room = await Classroom.findById(req.params.id);
  res.send(class_room); 
});

// Create a single classroom
router.post("/class_room/add", async (req, res) => {
  const refreshTimeSecs = req.body.refreshTimeSecs;
  const start_cron = req.body.start_cron;
  const end_cron = req.body.end_cron;
  const school = req.body.school;
  const room = req.body.room;
  const subject = req.body.subject;
  const group = req.body.group;
  const teacher = req.body.teacher;
  const active = req.body.active;
  const students = req.body.students;
  const supervisor = req.body.supervisor;
  try {
    const class_room = await Classroom.create({ refreshTimeSecs, start_cron, end_cron, school, room, subject, group, teacher, active, students, supervisor })
    const school2 = await School.findById(school)
    school2.class_rooms.push(class_room)
    school2.save()

    const room2 = await Room.findById(room)
    room2.class_rooms.push(class_room)
    room2.save()

    const subject2 = await Subject.findById(subject)
    subject2.class_rooms.push(class_room)
    subject2.save()

    const group2 = await Group.findById(group)
    group2.class_rooms.push(class_room)
    group2.save()

    const teacher2 = await Teacher.findById(teacher)
    teacher2.classes.push(class_room)
    teacher2.save()

    const supervisor2 = await Supervisor.findById(supervisor)
    supervisor2.classes.push(class_room)
    supervisor2.save()

    await asyncForEach(students, async (student) => {
      await waitFor(50);
      s = await Student.findById(student);
      s.classes.push(class_room)
      s.save()
    });
    
    res.status(200).json(class_room)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update a single classroom
router.post("/class_room/update/:id", async (req, res) => {
  var class_room = await Classroom.findById(req.params.id)

  // Data integrity example, must be replicated on other entities
  // or use the .pre and .post method on each of the required models
  await School.updateOne(
    { _id: class_room.school },
    { $pull: { class_rooms: class_room._id } }
  );

  await Room.updateOne(
    { _id: class_room.room },
    { $pull: { class_rooms: class_room._id } }
  );

  await Subject.updateOne(
    { _id: class_room.subject },
    { $pull: { class_rooms: class_room._id } }
  );

  await Group.updateOne(
    { _id: class_room.group },
    { $pull: { class_rooms: class_room._id } }
  );

  await Teacher.updateOne(
    { _id: class_room.teacher },
    { $pull: { classes: class_room._id } }
  );

  await Supervisor.updateOne(
    { _id: class_room.supervisor },
    { $pull: { classes: class_room._id } }
  );

  await Student.updateMany(
    {
      _id: { $in: [class_room.students._id] },
    },
    { $pull: { classes: class_room._id } }
  );

  console.log(class_room.group)

  await Classroom.updateOne(
    { _id: req.params.id },
    {
      refreshTimeSecs: req.body.refreshTimeSecs,
      start_cron: req.body.start_cron,
      end_cron: req.body.end_cron,
      school: req.body.school,
      room: req.body.room,
      subject: req.body.subject,
      group: req.body.group,
      teacher: req.body.teacher,
      active: req.body.active,
      students: req.body.students,
      supervisor: req.body.supervisor,
    },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    }
  );
  
  class_room = await Classroom.findById(req.params.id)
  console.log(class_room.group)

  await School.updateOne(
    { _id: class_room.school },
    { $push: { class_rooms: class_room._id } }
  );

  await Room.updateOne(
    { _id: class_room.room },
    { $push: { class_rooms: class_room._id } }
  );

  await Subject.updateOne(
    { _id: class_room.subject },
    { $push: { class_rooms: class_room._id } }
  );

  await Group.updateOne(
    { _id: class_room.group },
    { $push: { class_rooms: class_room._id } }
  );

  await Teacher.updateOne(
    { _id: class_room.teacher },
    { $push: { classes: class_room._id } }
  );

  await Supervisor.updateOne(
    { _id: class_room.supervisor },
    { $push: { classes: class_room._id } }
  );

  await Student.updateMany(
    {
      _id: { $in: [class_room.students._id] },
    },
    { $push: { classes: class_room } }
  );
});

// Delete a single class room
router.get('/class_room/delete/:id', function (req, res) {
  Classroom.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Get all class session
router.get('/class_sessions', async (req, res) => {
  const class_sessions = await ClassSession.find({});
  res.send(class_sessions); 
});

// Get single class session
router.get('/class_session/:id', async (req, res) => {
  const class_session = await ClassSession.findById(req.params.id);
  res.send(class_session); 
});

// Add a class session
router.post("/class_session/add", async (req, res) => {
  const active = req.body.active;
  const classroom = req.body.classroom;
  const date = req.body.date;
  try {
    const class_session = await ClassSession.create({ active, classroom, date })
    const room = await Classroom.findById(classroom)
    room.sessions.push(class_session)
    room.save()
    res.status(200).json(class_session)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update a class session
router.post("/class_session/update/:id", async (req, res) => {
  const class_session = await ClassSession.findById(req.params.id)
  try {
    class_session.active = req.body.active;
    class_session.classroom = req.body.classroom;
    class_session.save()
    res.status(200).json(class_session)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete a class session
router.get('/class_session/delete/:id', function (req, res) {
  ClassSession.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Obtain all summary group results
router.get('/group_results', async (req, res) => {
  const results = await GroupSummaryResult.find({});
  res.send(results); 
});

// Get a single summary group result
router.get('/group_result/:id', async (req, res) => {
  const result = await GroupSummaryResult.findById(req.params.id);
  res.send(result); 
});

// Add a single summary group result
router.post("/group_result/add", async (req, res) => {
  const data = req.body.data;
  const class_session = req.body.class_session;
  try {
    const result = await GroupSummaryResult.create({ data, class_session })
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update a single group result
router.post("/group_result/update/:id", async (req, res) => {
  const result = await GroupSummaryResult.findById(req.params.id)
  try {
    result.data = req.body.data;
    result.class_session = req.body.class_session;
    result.save()
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete a summary group result 
router.get('/group_result/delete/:id', function (req, res) {
  GroupSummaryResult.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Get all the individual summary results
router.get('/individual_results', async (req, res) => {
  const results = await IndividualSummaryResult.find({});
  res.send(results); 
});

// Get a single individual summary result
router.get('/individual_result/:id', async (req, res) => {
  const result = await IndividualSummaryResult.findById(req.params.id);
  res.send(result); 
});

// Add an individual summary result
router.post("/individual_result/add", async (req, res) => {
  const data = req.body.data;
  const user = req.body.user;
  const class_session = req.body.class_session;
  try {
    const result = await IndividualSummaryResult.create({ data, user, class_session })
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update an individual result
router.post("/individual_result/update/:id", async (req, res) => {
  const result = await IndividualSummaryResult.findById(req.params.id)
  try {
    result.data = req.body.data;
    result.user = req.body.user;
    result.class_session = req.body.class_session;
    result.save()
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete an individual summary result
router.get('/individual_result/delete/:id', function (req, res) {
  IndividualSummaryResult.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});


module.exports = router;
