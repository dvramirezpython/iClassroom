const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const autoPopulateAllFields = require('./populate_plugin')


// Represents a whole institute
var SchoolSchema = new Schema({
    name: {type: String, required: true, unique: true},
    indicator_groups: [{type: Schema.Types.ObjectId, ref: 'IndicatorGroup', required: false }],
    rooms: [{type: Schema.Types.ObjectId, ref: 'Room', required: false }],
    areas: [{type: Schema.Types.ObjectId, ref: 'Area', required: false }],
    class_rooms: [{type: Schema.Types.ObjectId, ref: 'Classroom', required: false }],
    students: [{type: Schema.Types.ObjectId, ref: 'Student', required: false }],
    teachers: [{type: Schema.Types.ObjectId, ref: 'Teacher', required: false }],
});

SchoolSchema.plugin(autoPopulateAllFields);
const School = mongoose.model('School', SchoolSchema);

// Represents a colection of related careers, example: Social Sciences
var AreaSchema = new Schema({
    name: {type: String, required: true},
    school:{type: Schema.Types.ObjectId, ref: 'School', required: true },
    careers: [{type: Schema.Types.ObjectId, ref: 'Career', required: false }],
    subjects: [{type: Schema.Types.ObjectId, ref: 'Subject', required: false }],
});

AreaSchema.plugin(autoPopulateAllFields);
const Area = mongoose.model('Area', AreaSchema);

// Represents a single career
var CareerSchema = new Schema({
    name: {type: String, required: true},
    area:{type: Schema.Types.ObjectId, ref: 'Area', required: true}
});

CareerSchema.plugin(autoPopulateAllFields);
const Career = mongoose.model('Career', CareerSchema);

// Represents a fisical room inside a school, example: Aulas 3 - 202
var RoomSchema = new Schema({
    name: {type: String, required: true},
    school:{type: Schema.Types.ObjectId, ref: 'School', required: true},
    class_rooms: [{type: Schema.Types.ObjectId, ref: 'Classroom', required: false }],
});

RoomSchema.plugin(autoPopulateAllFields);
const Room = mongoose.model('Room', RoomSchema);

// Represents a scholar subject
var SubjectSchema = new Schema({
    name: {type: String, required: true},
    area: {type: Schema.Types.ObjectId, ref: 'Area', required: true},
    groups: [{type: Schema.Types.ObjectId, ref: 'Group', required: false }],
    class_rooms: [{type: Schema.Types.ObjectId, ref: 'Classroom', required: false }],
});

SubjectSchema.plugin(autoPopulateAllFields);
const Subject = mongoose.model('Subject', SubjectSchema);

// Represents a single group related to a career
var GroupSchema = new Schema({
    group_key: {type: String, required: true},
    subject: {type: Schema.Types.ObjectId, ref: 'Subject', required: true},
    class_rooms: [{type: Schema.Types.ObjectId, ref: 'Classroom', required: false }],
});

GroupSchema.plugin(autoPopulateAllFields);
const Group = mongoose.model('Group', GroupSchema);


module.exports = { School, Area, Career, Room, Subject, Group }
