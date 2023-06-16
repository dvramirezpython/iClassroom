const express = require("express");
const router = express.Router();
var cors = require('cors')
const app = express();
const { School, Area, Career, Room, Subject, Group } = require('../models/schoolModels');
const { IndicatorGroup } = require('../models/indicatorModels');
const { ObjectID } = require("mongodb");

app.use(cors())

// Get all schools
router.get('/schools', async (req, res) => {
  const schools = await School.find({});
  res.send(schools);  
});

// Get a single school
router.get('/school/:id', async (req, res) => {
  const school = await School.findById(req.params.id)
  res.send(school); 
});

// Create a school
router.post("/school/add", async (req, res) => {
  const name = req.body.name;
  try {
    const school = await School.create({ name })

    // Automatically create all indicator groups for each school
    const group_1 = await IndicatorGroup.create({ school, ind_type: "Engagement" })
    const group_2 = await IndicatorGroup.create({ school, ind_type: "Attention" })
    const group_3 = await IndicatorGroup.create({ school, ind_type: "Interaction" })
    const group_4 = await IndicatorGroup.create({ school, ind_type: "Distractions" })
    school.indicator_groups.push(group_1)
    school.indicator_groups.push(group_2)
    school.indicator_groups.push(group_3)
    school.indicator_groups.push(group_4)
    school.save()
    res.status(200).json("School created")
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});


// Updte a single school
router.post("/school/update/:id", async (req, res) => {
  const school = await School.findById(req.params.id)
  try {
    school.name = req.body.name;
    school.save()
    res.status(200).json(school)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});


// Delete a single school
router.get('/school/delete/:id', function (req, res) {
  School.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Get all areas
router.get('/areas', async (req, res) => {
  const areas = await Area.find({}).populate('school');
  res.send(areas); 
});

// Get all areas for a single school
router.get('/areasPerSchool/:schoolId', async (req, res) => {
  let areas = await Area.find({}).populate('school');
  areas = areas.filter((area) => area.school._id == req.params.schoolId);
  res.send(areas); 
});

// Get a single area
router.get('/area/:id', async (req, res) => {
  const area = await Area.findById(req.params.id).populate('school');
  res.send(area); 
});

// Add an area
router.post("/area/add", async (req, res) => {
  const name = req.body.name;
  const school = req.body.school;
  try {
    const area = await Area.create({ name, school })
    const school2 = await School.findById(school)
    school2.areas.push(area)
    school2.save()
    res.status(200).json(area)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update an area
router.post("/area/update/:id", async (req, res) => {
  const area = await Area.findById(req.params.id)
  try {
    area.name = req.body.name;
    area.school = req.body.school;
    area.save()
    res.status(200).json(area)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete a single area
router.get('/area/delete/:id', function (req, res) {
  Area.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Get all careers
router.get('/careers', async (req, res) => {
  const careers = await Career.find({}).populate({
    path : 'area',
    populate : {
      path : 'school'
    }
  })
  res.send(careers); 
});

// Get a single career
router.get('/career/:id', async (req, res) => {
  const career = await Career.findById(req.params.id).populate({
    path : 'area',
    populate : {
      path : 'school'
    }
  });
  res.send(career); 
});

// Add a new career
router.post("/career/add", async (req, res) => {
  const name = req.body.name;
  const area = req.body.area;
  try {
    const career = await Career.create({ name, area })
    const area2 = await Area.findById(area)
    area2.careers.push(career)
    area2.save()
    res.status(200).json(career)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update a career
router.post("/career/update/:id", async (req, res) => {
  const career = await Career.findById(req.params.id)
  try {
    career.name = req.body.name;
    career.area = req.body.area;
    career.save()
    res.status(200).json(career)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete a career
router.get('/career/delete/:id', function (req, res) {
  Career.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Get all fisical rooms
router.get('/rooms', async (req, res) => {
  const rooms = await Room.find({}).populate('school');
  res.send(rooms); 
});

// Get a single room
router.get('/room/:id', async (req, res) => {
  const room = await Room.findById(req.params.id).populate('school');
  res.send(room); 
});

// Add a single room
router.post("/room/add", async (req, res) => {
  const name = req.body.name;
  const school = req.body.school;
  try {
    const room = await Room.create({ name, school })
    const school2 = await School.findById(school)
    school2.rooms.push(room)
    school2.save()
    res.status(200).json(room)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update a single room 
router.post("/room/update/:id", async (req, res) => {
  const room = await Room.findById(req.params.id)
  try {
    room.name = req.body.name;
    room.school = req.body.school;
    room.save()
    res.status(200).json(room)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete a single room
router.get('/room/delete/:id', function (req, res) {
  Room.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Obtain all rooms that belong to a school
router.get('/roomsPerSchool/:schoolId', async (req, res) => {
  let rooms = await Room.find({}).populate('school');
  rooms = rooms.filter((room) => room.school._id == req.params.schoolId);
  res.send(rooms); 
});



// Get all subjects
router.get('/subjects', async (req, res) => {
  const subjects = await Subject.find({}).populate({
    path : 'area',
    populate : {
      path : 'school'
    }
  });
  res.send(subjects); 
});

// Get all subjects that belong to an area
router.get('/subjectsPerArea/:areaId', async (req, res) => {
  let subjects = await Subject.find({}).populate('area');
  subjects = subjects.filter((subject) => subject.area._id == req.params.areaId);
  res.send(subjects); 
});

// Obtain a single subject
router.get('/subject/:id', async (req, res) => {
  const subject = await Subject.findById(req.params.id).populate({
    path : 'area',
    populate : {
      path : 'school'
    }
  });
  res.send(subject); 
});

// Obtain all groups that are in a single subject
router.get('/groupsPerSubject/:subjectId', async (req, res) => {
  let groups = await Group.find({}).populate('subject');
  groups = groups.filter((group) => group.subject._id == req.params.subjectId);
  res.send(groups);
})


// Add a subject
router.post("/subject/add", async (req, res) => {
  const name = req.body.name;
  const area = req.body.area;
  try {
    const subject = await Subject.create({ name, area })
    const area2 = await Area.findById(area)
    area2.subjects.push(subject)
    area2.save()
    res.status(200).json(subject)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update a single subject
router.post("/subject/update/:id", async (req, res) => {
  const subject = await Subject.findById(req.params.id)
  try {
    subject.name = req.body.name;
    subject.area = req.body.area;
    subject.save()
    res.status(200).json(subject)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete a subject
router.get('/subject/delete/:id', function (req, res) {
  Subject.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Get all groups
router.get('/groups', async (req, res) => {
  const groups = await Group.find({}).populate('subject');
  res.send(groups); 
});

// Obtain a single group
router.get('/group/:id', async (req, res) => {
  const group = await Group.findById(req.params.id).populate('subject');
  res.send(group); 
});

// Add a single group
router.post("/group/add", async (req, res) => {
  const group_key = req.body.group_key;
  const subject = req.body.subject;
  try {
    const group = await Group.create({ group_key, subject })
    const subject2 = await Subject.findById(subject)
    subject2.groups.push(group)
    subject2.save()
    res.status(200).json(group)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update a single group
router.post("/group/update/:id", async (req, res) => {
  const group = await Group.findById(req.params.id)
  try {
    group.group_key = req.body.group_key;
    group.subject = req.body.subject;
    group.save()
    res.status(200).json(group)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete a single group
router.get('/group/delete/:id', function (req, res) {
  Group.deleteOne({ _id: req.params.id },
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
