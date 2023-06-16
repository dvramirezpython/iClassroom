const express = require("express");
const router = express.Router();
var cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const {
  Administrator,
  Student,
  Teacher,
  Supervisor,
  User,
} = require("../models/userModels");
const { School } = require("../models/schoolModels");
const { decrypt } = require("../encrypt");
const { encrypt } = require("../encrypt");
const bcrypt = require("bcryptjs");

// Middleware used for storing files, currently saves to /uploads folder on the server
// destination is expected to be changed to a cloud storage service or intranet service
const multer = require("multer");
var storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(cors());


// expected picture files for the login
const cpUpload = upload.fields([
  { name: "front_photo_url", maxCount: 1 },
  { name: "right_photo_url", maxCount: 1 },
  { name: "left_photo_url", maxCount: 1 },
  { name: "voice_register_url", maxCount: 1 },
]);

// Add User
router.post("/user/add", cpUpload, async (req, res) => {
  const userType = req.body.user_type;
  const name = req.body.name;
  const last_name = req.body.last_name;
  const email = req.body.email;

  // Photo files for login, must be one on each request key
  const front_photo_url = req.files.front_photo_url[0].path.replace(/\\/g, "/");
  const right_photo_url = req.files.right_photo_url[0].path.replace(/\\/g, "/");
  const left_photo_url = req.files.left_photo_url[0].path.replace(/\\/g, "/");
  const voice_register_url = req.files.voice_register_url[0].path.replace(/\\/g, "/");

  // Check if mail is unique, can be deprecated as mongoose already checks unique value
  // but would have to be changed to return another error
  try {
    const valid_user = await User.findOne({ email: email });

    if (valid_user) res.status(409).json({ message: "Email already in use." });
  } catch (error) {
    res.status(400).json({message: error});
  }

  const activated = req.body.activated;
  const password_text = req.body.password;

  try {
    const password = await encrypt(password_text); // encrypts password using SHA256 standard

    var user;
    // Requires specific fields for each user type
    if (userType == "admin") {
      user = await Administrator.create({
        name,
        last_name,
        front_photo_url,
        right_photo_url,
        email,
        left_photo_url,
        voice_register_url,
        activated,
        password,
      });
    } else if (userType == "student") {
      const tuition = req.body.tuition;
      const school = req.body.school;
      user = await Student.create({
        name,
        last_name,
        front_photo_url,
        right_photo_url,
        email,
        left_photo_url,
        voice_register_url,
        activated,
        tuition,
        password,
        school,
      });
      const school2 = await School.findById(school);
      school2.students.push(user);
      school2.save();
    } else if (userType == "teacher") {
      const school = req.body.school;
      user = await Teacher.create({
        name,
        last_name,
        front_photo_url,
        right_photo_url,
        email,
        left_photo_url,
        voice_register_url,
        activated,
        password,
        school
      });
      const school2 = await School.findById(school);
      school2.teachers.push(user);
      school2.save();
    } else if (userType == "supervisor") {
      const responsability = req.body.responsability;
      user = await Supervisor.create({
        name,
        last_name,
        front_photo_url,
        right_photo_url,
        email,
        left_photo_url,
        voice_register_url,
        activated,
        responsability,
        password,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get("/users", (req, res) => {
  User.find({}, function (err, users) {
    var userMap = [];

    users.forEach(function (user) {
      userMap.push(user);
    });

    res.send(userMap);
  });
});


// Get all not approved users
router.get("/users/pending", (req, res) => {
  User.find({ activated: null }, (err, users) => {
    var userMap = [];

    users.forEach(function (user) {
      userMap.push(user);
    });

    res.send(userMap);
  });
});


// Update a user
router.post("/user/update/:id", async (req, res) => {
  console.log("Updating user");

  const userType = req.body.user_type;
  let userFound = "";

  if (userType == "Administrator") {
    userFound = await Administrator.findById(req.params.id);
  } else if (userType == "Student") {
    userFound = await Student.findById(req.params.id);
  } else if (userType == "Teacher") {
    userFound = await Teacher.findById(req.params.id);
  } else if (userType == "Supervisor") {
    userFound = await Supervisor.findById(req.params.id);
  }

  if (!userFound) {
    res.status(404).send("User not found");
  } else {
    userFound.name = req.body.name;
    userFound.last_name = req.body.last_name;
    userFound.email = req.body.email;
    userFound.front_photo_url = req.body.front_photo_url;
    userFound.right_photo_url = req.body.right_photo_url;
    userFound.left_photo_url = req.body.left_photo_url;
    userFound.voice_register_url = req.body.voice_register_url;
    userFound.activated = req.body.activated;
    userFound.responsability = req.body.responsability;
    userFound.tuition = req.body.tuition;
    try {
      await userFound.save();
      res.status(200).json(userFound);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
});


//Get student per school
router.get("/studentsPerSchool/:schoolId", async (req, res) => {
  const students = await User.find({__t: "Student", school: req.params.schoolId, activated: true});
  res.send(students);
})


//Get professors per school
router.get("/teachersPerSchool/:schoolId", async (req, res) => {
  const teachers = await User.find({__t: "Teacher", school: req.params.schoolId, activated: true});
  res.send(teachers);
})


// Get all user types
router.get("/supervisors", async (req, res) => {
  const supervisors = await User.find({ __t: "Supervisor" });
  res.send(supervisors);
});

// Get all students
router.get("/students", async (req, res) => {
  const students = await User.find({ __t: "Student" }).populate('school');
  res.send(students);
});

// Get all teachers
router.get("/teachers", async (req, res) => {
  const teachers = await User.find({ __t: "Teacher" }).populate('school');
  res.send(teachers);
});

// Get all admins
router.get("/administrators", async (req, res) => {
  const administrators = await User.find({ __t: "Administrator" });
  res.send(administrators);
});

//Delete user
router.delete("/user/:id", async (req, res) => {
  console.log("Deleting user");
  const deleted = await User.deleteOne({ _id: req.params.id });
  if (deleted.deletedCount == 1) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(400).json({ error: error.message });
  }
});

// Auth for logging in
router.get("/login", async (req, res) => {
  try {
    const { email, password } = req.query;
    const pass_sent = password;
    const user = await User.findOne({ email: email });

    const password_match = await new Promise((resolve, reject) => {
      bcrypt.compare(pass_sent, user.password, function (err, isValid) {
        if (err) reject(err);
        resolve(isValid);
      });
    });

    if (password_match) {
      res.status(200).send(user);
    } else {
      res.send({ error: "User or password is incorrect password match" });
    }
  } catch (error) {
    console.log(error);
    res.status(404);
    res.send("Error");
  }
});

module.exports = router;
