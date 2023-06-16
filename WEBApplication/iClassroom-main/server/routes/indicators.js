const express = require("express");
const router = express.Router();
var cors = require('cors')
const app = express();
const { Indicator, IndicatorGroup, IndicatorLog } = require('../models/indicatorModels');
const { School, Area, Career, Room, Subject, Group } = require('../models/schoolModels');
const { Classroom, ClassSession, GroupSummaryResult, IndividualSummaryResult } = require('../models/sessionModels')
const { ObjectID } = require("mongodb");

app.use(cors())

// Method for using a for loop inside an asynchronous function
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

// Method for obtaining a random integer
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

// Method for obtaining a random float
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

// Method for obtaining a random boolean (either 1 or 0)
function getRandomBool() {
  return Math.round(Math.random());
}

// Method for obtaining average of an array
function average(array) {
  return array.reduce((x,y) => x+y)/array.length
}

// Get all indicator groups
router.get('/indicator_groups', async (req, res) => {
  const groups = await IndicatorGroup.find({});
  res.send(groups); 
});

// Get a single indicator group
router.get('/indicator_group/:id', async (req, res) => {
  const group = await IndicatorGroup.findById(req.params.id);
  res.send(group); 
});

// Add a single indicator group, not really needed
router.post("/indicator_group/add", async (req, res) => {
  const school = req.body.school;
  const ind_type = req.body.ind_type;
  try {
    const group = await IndicatorGroup.create({ school, ind_type })
    const school2 = await School.findById(school)
    school2.indicator_groups.push(group)
    school2.save()
    res.status(200).json(group)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update an indicator group, not really needed
router.post("/indicator_group/update/:id", async (req, res) => {
  const group = await IndicatorGroup.findById(req.params.id)
  try {
    group.school = req.body.school;
    group.ind_type = req.body.ind_type;
    group.save()
    res.status(200).json(group)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete an indicator group
router.get('/indicator_group/delete/:id', function (req, res) {
  IndicatorGroup.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Get all indicators
router.get('/indicators', async (req, res) => {
  const indicators = await Indicator.find({});
  res.send(indicators); 
});

// Get a single indicator
router.get('/indicator/:id', async (req, res) => {
  const indicator = await Indicator.findById(req.params.id);
  res.send(indicator); 
});

// Add a single indicator
router.post("/indicator/add", async (req, res) => {
  const indicator_group = req.body.indicator_group;
  const name = req.body.name;
  const description = req.body.description;
  const data_type = req.body.data_type;
  const weight = req.body.weight;
  const type = req.body.type;
  try {
    const indicator = await Indicator.create({ indicator_group, name, description, data_type, weight, type })
    const group = await IndicatorGroup.findById(indicator_group)
    group.indicators.push(indicator)
    group.save()
    res.status(200).json(indicator)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Update an indicator
router.post("/indicator/update/:id", async (req, res) => {
  const indicator = await Indicator.findById(req.params.id)
  try {
    indicator.indicator_group = req.body.indicator_group;
    indicator.name = req.body.name;
    indicator.description = req.body.description;
    indicator.data_type = req.body.data_type;
    indicator.weight = req.body.weight;
    indicator.save()
    res.status(200).json(indicator)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete a single indicator
router.get('/indicator/delete/:id', function (req, res) {
  Indicator.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Get all the indicator logs
router.get('/indicator_logs', async (req, res) => {
  const indicator_logs = await IndicatorLog.find({});
  res.send(indicator_logs); 
});

// Get a single log
router.get('/indicator_log/:id', async (req, res) => {
  const indicator_log = await IndicatorLog.findById(req.params.id);
  res.send(indicator_log); 
});

// Add a single indicator log
router.post("/indicator_log/add", async (req, res) => {
  const indicator = req.body.indicator;
  const time_register = req.body.time_register;
  const value = req.body.value;
  const user = req.body.user;
  const class_session = req.body.class_session;
  try {
    const indicator_log = await IndicatorLog.create({ indicator, time_register, value, user, class_session })
    res.status(200).json(indicator_log)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Get the results of the values of the group statistics
router.get("/indicator_log/get_temp_group/:session_id", async (req, res) => {
  // Filter the last register of each indicator type-session-user
  const indicator_logs = await IndicatorLog.aggregate([
    {
      $match : { "class_session": { $eq: ObjectID(req.params.session_id) } }
    },
    {$group: {
        "_id": ["$indicator", "$user"],
        "value": {"$last": '$value'},
        "time_register": {"$last": '$time_register'},
    }},
    {$project: {
        "value": "$value",
        "time_register": "$time_register"
    }},
    {$sort: {
        "time_register": -1
    }}
  ]);
  // Start retrieved values as 0
  var values_dict = {'Engagement':[0,0], 'Attention':[0,0], 'Interaction':[0,0], 'Distractions':[0,0]};
  var indicator;
  var values_total = {};
  var seen_individual_indicators = {};

  await asyncForEach(indicator_logs, async (log) => {
    // Obtain log info
    indicator = await Indicator.findById(log._id[0]);
    const ind_group_type = indicator.indicator_group.ind_type
    const ind_type = indicator.type
    const value = parseFloat(log.value)
    // If it belongs to group indicator just adds the weight and the weighed value
    if (ind_type == 'Group') {
      values_dict[ind_group_type][0] += indicator.weight
      values_dict[ind_group_type][1] += (value/100.0) * indicator.weight
    } else {
      // If indicator is individual checks if it was already seen, if not, add the weight of the indicator and stores the name
      if (!(indicator.name in seen_individual_indicators)) {
        values_dict[ind_group_type][0] += indicator.weight
        seen_individual_indicators[indicator.name] = [ind_group_type]
      }
      // Sums the weighed value of the seen indicator
      seen_individual_indicators[indicator.name].push((value/100.0) * indicator.weight)
    }
  });

  // Makes weighed average of the individual indicators
  for (const [key, value] of Object.entries(seen_individual_indicators)) {
    var type = value[0]
    var avg = average(value.slice(1))
    values_dict[type][1] += avg
  }

  // Obtains the percentage values of each of the indicator types
  for (const [key, value] of Object.entries(values_dict)) {
    if (value[1] == 0) {
      values_total[key] = 0
    }
    else {
      values_total[key] = (value[1]/value[0]) * 100
    }
  }

  res.send(values_total);
});

// Same as /indicator_log/get_temp_group/:session_id but filtering just the distractor indicators
// It also retrieves a value for each indicator of the type
router.get("/indicator_log/get_temp_distractors/:session_id", async (req, res) => {
  const indicator_logs = await IndicatorLog.aggregate([
    {
      $match : { "class_session": { $eq: ObjectID(req.params.session_id) } }
    },
        {$group: {
            "_id": ["$indicator", "$user"],
            "value": {"$last": '$value'},
            "time_register": {"$last": '$time_register'},
        }},
        {$project: {
            "value": "$value",
            "time_register": "$time_register"
        }},
        {$sort: {
            "time_register": -1
        }}
    ]);
  var indicator;
  var distractor_values = {};
  var distractor_individual_indicators = {};
  var seen_individual_indicators = {};

  await asyncForEach(indicator_logs, async (log) => {
    indicator = await Indicator.findById(log._id[0]);
    const ind_group_type = indicator.indicator_group.ind_type
    const ind_type = indicator.type
    const value = parseFloat(log.value)
    if (ind_type == 'Group') {
      if (ind_group_type == 'Distractions') {
        distractor_values[indicator.name] = value
      }
    } else {
      if (!(indicator.name in seen_individual_indicators)) {
        if (ind_group_type == 'Distractions') {
          distractor_individual_indicators[indicator.name] = []
        }
      }
      if (ind_group_type == 'Distractions') {
        distractor_individual_indicators[indicator.name].push(value)
      }
    }
  });


  for (const [k, value] of Object.entries(distractor_individual_indicators)) {
    var avg = average(value)
    distractor_values[k] = avg
  }

  res.send(distractor_values);
});

// On the meantime it returns a random value for each of the students in a class session
// It is expected to later  use the logs when there is an usage consensus
router.get("/indicator_log/get_temp_individual/:session_id", async (req, res) => {
  const indicator_logs = await IndicatorLog.aggregate([
    {
      $match : { "class_session": { $eq: ObjectID(req.params.session_id) } }
    },
        {$group: {
            "_id": ["$indicator", "$user"],
            "value": {"$last": '$value'},
            "time_register": {"$last": '$time_register'},
        }},
        {$project: {
            "value": "$value",
            "time_register": "$time_register"
        }},
        {$sort: {
            "time_register": -1
        }}
    ]);

  var student_values = {}
  const class_session = await ClassSession.findById(req.params.session_id);
  const students = class_session.classroom.students
  await asyncForEach(students, async (student) => {
    student_values[student] = getRandomInt(0,101);
  });

  res.send(student_values);
});


// Deprecated get results endpoint, it obtains each of the said values that will be used on the teacher dashboard
// It is now splitted on the 3 endpoints created on the upside lines
router.get("/indicator_log/get_temp_results/:session_id", async (req, res) => {
  const indicator_logs = await IndicatorLog.aggregate([
    {
      $match : { "class_session": { $eq: ObjectID(req.params.session_id) } }
    },
        {$group: {
            "_id": ["$indicator", "$user"],
            "value": {"$last": '$value'},
            "time_register": {"$last": '$time_register'},
        }},
        {$project: {
            "value": "$value",
            "time_register": "$time_register"
        }},
        {$sort: {
            "time_register": -1
        }}
    ]);

  var values_dict = {'Engagement':[0,0], 'Attention':[0,0], 'Interaction':[0,0], 'Distractions':[0,0]};
  var indicator;
  var values_total = {};
  var distractor_values = {};
  var distractor_individual_indicators = {};
  var seen_individual_indicators = {};

  // Group values and distractors
  /*
    100.0 should be replaced by "max values" of indicators eventually
  */
  await asyncForEach(indicator_logs, async (log) => {
    indicator = await Indicator.findById(log._id[0]);
    const ind_group_type = indicator.indicator_group.ind_type
    const ind_type = indicator.type
    const value = parseFloat(log.value)
    if (ind_type == 'Group') {
      values_dict[ind_group_type][0] += indicator.weight
      values_dict[ind_group_type][1] += (value/100.0) * indicator.weight
      if (ind_group_type == 'Distractions') {
        distractor_values[indicator.name] = value
      }
    } else {
      if (!(indicator.name in seen_individual_indicators)) {
        values_dict[ind_group_type][0] += indicator.weight
        seen_individual_indicators[indicator.name] = [ind_group_type]
        if (ind_group_type == 'Distractions') {
          distractor_individual_indicators[indicator.name] = []
        }
      }
      seen_individual_indicators[indicator.name].push((value/100.0) * indicator.weight)
      if (ind_group_type == 'Distractions') {
        distractor_individual_indicators[indicator.name].push(value)
      }
    }
  });


  for (const [key, value] of Object.entries(seen_individual_indicators)) {
    var type = value[0]
    var avg = average(value.slice(1))
    values_dict[type][1] += avg
  }

  for (const [k, value] of Object.entries(distractor_individual_indicators)) {
    var avg = average(value)
    distractor_values[k] = avg
  }


  for (const [key, value] of Object.entries(values_dict)) {
    if (value[1] == 0) {
      values_total[key] = 0
    }
    else {
      values_total[key] = (value[1]/value[0]) * 100
    }
  }

  // Individual values
  var student_values = {}
  const class_session = await ClassSession.findById(req.params.session_id);
  const students = class_session.classroom.students
  await asyncForEach(students, async (student) => {
    student_values[student] = getRandomInt(0,101);
  });

  const total_results = [values_total, student_values, distractor_values]

  res.send(total_results);
});


// Function in charge of creating fake logs depending on the data type and the subscribed indicators
async function auto_add_logs(session_id) {
  const class_session = await ClassSession.findById(session_id);
  const indicator_groups = class_session.classroom.school.indicator_groups
  var indicators = []
  var ind_group_indicators;

  await asyncForEach(indicator_groups, async (ind_group) => {
    await waitFor(50);
    ind_group_indicators = await IndicatorGroup.findById(ind_group);
    indicators = indicators.concat(ind_group_indicators.indicators);
  });

  var indicator;
  var rand_val;
  await asyncForEach(indicators, async (ind) => {
    await waitFor(50);
    indicator = await Indicator.findById(ind);
    if (indicator.type == 'Group') {
      if (indicator.data_type == "int") {
        rand_val = getRandomInt(0,101);
      }
      else if (indicator.data_type == "float") {
        rand_val = getRandomFloat(0,100, 2);
      }
      else if (indicator.data_type == "bool") {
        rand_val = getRandomBool();
      }
      const indicator_log = await IndicatorLog.create({
        indicator: ind,
        time_register: Date.now(),
        value: rand_val,
        class_session: class_session._id,
        user: null
      });
    }
    else {
      await asyncForEach(class_session.classroom.students, async (student) => {
        await waitFor(50);
        if (indicator.data_type == "int") {
          rand_val = getRandomInt(0,101);
        }
        else if (indicator.data_type == "float") {
          rand_val = getRandomFloat(0,100, 2);
        }
        else if (indicator.data_type == "bool") {
          rand_val = getRandomBool();
        }
        const indicator_log = await IndicatorLog.create({
          indicator: ind,
          time_register: Date.now(),
          value: rand_val,
          class_session: class_session._id,
          user: student
        });
      });
    }
  });
}

// Endpoint to call the method to create the auto add functions
router.post("/indicator_log/auto_add/:session_id", async (req, res) => {
  await auto_add_logs((req.params.session_id));
  res.status(200).json({message: "Created"})
});

// Update a single log, should not be used
router.post("/indicator_log/update/:id", async (req, res) => {
  const indicator_log = await IndicatorLog.findById(req.params.id)
  try {
    indicator_log.indicator = req.body.indicator;
    indicator_log.time_register = req.body.time_register;
    indicator_log.value = req.body.value;
    indicator_log.user = req.body.user;
    indicator_log.class_session = req.body.class_session;
    indicator_log.save()
    res.status(200).json(indicator_log)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});

// Delete an indicator logs
router.get('/indicator_log/delete/:id', function (req, res) {
  IndicatorLog.deleteOne({ _id: req.params.id },
    function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Distractors
router.get('/distractor', async (req, res) => {
  var indicators = await Indicator.find({}).populate({
    path : 'indicator_group',
    populate : {
      path : 'school'
    }
  });;
  indicators = indicators.filter((indicator) => indicator.indicator_group.ind_type == 'Distractions');
  res.send(indicators); 
});

//Engagement
router.get('/engagement', async (req, res) => {
  var indicators = await Indicator.find({}).populate('indicator_group');
  indicators = indicators.filter((indicator) => indicator.indicator_group.ind_type == 'Engagement');
  res.send(indicators); 
});

//Attention
router.get('/attention', async (req, res) => {
  var indicators = await Indicator.find({}).populate('indicator_group');
  indicators = indicators.filter((indicator) => indicator.indicator_group.ind_type == 'Attention');
  res.send(indicators); 
});

//Interaction
router.get('/interaction', async (req, res) => {
  var indicators = await Indicator.find({}).populate('indicator_group');
  indicators = indicators.filter((indicator) => indicator.indicator_group.ind_type == 'Interaction');
  res.send(indicators); 
});


module.exports = router;
