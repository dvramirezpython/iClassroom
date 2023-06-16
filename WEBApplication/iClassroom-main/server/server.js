const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config({ path: "./config.env" }); // Obtain the port for the server and the URI of the database
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Use all the routes createdo for entities
app.use(require("./routes/user"));
app.use(require("./routes/school_entities"));
app.use(require("./routes/class_session"));
app.use(require("./routes/indicators"));

// get driver connection
const mongoose = require("mongoose");
const Db = process.env.ATLAS_URI; // Has to be the active server on localhost or a Mongo Atlas URI

console.log(Db);

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// Connect to the database using the mongoose package
mongoose.connect(Db, { useNewUrlParser: true, dbName: 'iClassroom' })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Succesfully connected on port ', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })
