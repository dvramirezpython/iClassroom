const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const autoPopulateAllFields = require('./populate_plugin')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { School, Area, Career, Room, Subject, Group } = require('./schoolModels');
const {Administrator, Student, Teacher, Supervisor, User} = require('./userModels');

// Model that represent a recurrent class that will be imparted in a semester (has a subject and a place)
var ClassroomSchema = new Schema({
    refreshTimeSecs: {type: Number, required: true, default: 30},
    start_cron: {type: String, required: true},
    end_cron: {type: String, required: true},
    school:{type: Schema.Types.ObjectId, ref: 'School', required: true },
    room: {type: Schema.Types.ObjectId, ref: 'Room', required: true },
    subject: {type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    group: {type: Schema.Types.ObjectId, ref: 'Group', required: true },
    sessions: [{type: Schema.Types.ObjectId, ref: 'ClassSession', required: false }],
    teacher: {type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    students: [{type: Schema.Types.ObjectId, ref: 'Student', required: false }],
    supervisor: [{type: Schema.Types.ObjectId, ref: 'Supervisor', required: false }],
    active: {type: Boolean, required: true, default: true},
});

ClassroomSchema.plugin(autoPopulateAllFields);

// This both should be used to maintain data integrity, was not finished and implemented
// manually on the endpoint
ClassroomSchema.pre('updateOne', async function() {

});

ClassroomSchema.post('updateOne', async function() {
    
});

const Classroom = mongoose.model('Classroom', ClassroomSchema);

// Represents a single imparted class on a subject
var ClassSessionSchema = new Schema({
    active: {type: Boolean, required: true, default: false},
    classroom:{type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
    date: {type: Date, required: true}
});

ClassSessionSchema.plugin(autoPopulateAllFields);
const ClassSession = mongoose.model('ClassSession', ClassSessionSchema);

// Represents the summary at the end of a session, is not used on the meantime
var GroupSummaryResultSchema = new Schema({
    data: {type: String, required: true},
    class_session: {type:Schema.Types.ObjectId, ref: 'ClassSession', required: true }
});

GroupSummaryResultSchema.plugin(autoPopulateAllFields);
const GroupSummaryResult = mongoose.model('GroupSummaryResult', GroupSummaryResultSchema);

// Represents the summary of each student at the end of a session, is not used in the meantime
var IndividualSummaryResultSchema = new Schema({
    data: {type: String, required: true},
    user: {type:Schema.Types.ObjectId, ref: 'User', required: true },
    class_session: {type:Schema.Types.ObjectId, ref: 'ClassSession', required: true }
});

IndividualSummaryResultSchema.plugin(autoPopulateAllFields);
const IndividualSummaryResult = mongoose.model('IndividualSummaryResult', IndividualSummaryResultSchema);

module.exports = { Classroom, ClassSession, GroupSummaryResult, IndividualSummaryResult }