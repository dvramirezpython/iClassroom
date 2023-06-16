const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const autoPopulateAllFields = require('./populate_plugin')

// Represents a collection of indicators, can only be of selected typess
var IndicatorGroupSchema = new Schema({
    school:{ type: Schema.Types.ObjectId, ref: 'School', required: true },
    ind_type: { type: String, enum: ['Engagement', 'Attention', 'Interaction', 'Distractions'], required: true },
    indicators: [{ type: Schema.Types.ObjectId, ref: 'Indicator', required: true }]
});

IndicatorGroupSchema.plugin(autoPopulateAllFields);
const IndicatorGroup = mongoose.model('IndicatorGroup', IndicatorGroupSchema);

// Represents a single indicator, it can be groupal or individual
var IndicatorSchema = new Schema({
    indicator_group:{ type: Schema.Types.ObjectId, ref: 'IndicatorGroup', required: true },
    name: {type: String, required: true},
    description: {type: String, required: false},
    data_type: { type: String, enum: ['str', 'int', 'float', 'bool'] },
    weight: {type: Number, required: true, default: 0.0},
    type: { type: String, enum: ['Individual', 'Group'], required: true },
});

IndicatorSchema.plugin(autoPopulateAllFields);
const Indicator = mongoose.model('Indicator', IndicatorSchema);

// Represents a register of the value of an indicator on a timestamp
var IndicatorLogSchema = new Schema({   
    indicator:{type: Schema.Types.ObjectId, ref: 'Indicator', required: true },
    time_register: {type: Date, required: true, default: Date.now},
    value: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: false },
    class_session: {type: Schema.Types.ObjectId, ref: 'ClassSession', required: true }
});

IndicatorLogSchema.plugin(autoPopulateAllFields);
const IndicatorLog = mongoose.model('IndicatorLog', IndicatorLogSchema);

module.exports = { Indicator, IndicatorGroup, IndicatorLog }