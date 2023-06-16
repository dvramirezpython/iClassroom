const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' };

// Parent Model that represents all the users that are in the system
const UserSchema = new mongoose.Schema ({                              
        name: {type: String, required: true},
        last_name: {type: String, required: true},
        front_photo_url: {type: String, required: true},
        right_photo_url: {type: String, required: true},
        left_photo_url: {type: String, required: true},
        voice_register_url: {type: String, required: true},
        activated: {type: Boolean, required: false},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
    }, 
    { timestamps: true }, options                       
)

// Basic user
const User = mongoose.model('User', UserSchema)

// Child model of the user that represents admins
const Administrator = User.discriminator('Administrator',
                            new mongoose.Schema({ }, options));

// Child model of the user that represents the students of a class
const Student = User.discriminator('Student',
                            new mongoose.Schema({ 
                                tuition: {type: String, required: true},
                                classes: [{type: Schema.Types.ObjectId, ref: 'Classroom', required: false }],
                                school: {type: Schema.Types.ObjectId, ref: 'School', required: false },
                            }, options));
  
// Child model of the user that represents teachers
const Teacher = User.discriminator('Teacher',
                            new mongoose.Schema({ 
                                classes: [{type: Schema.Types.ObjectId, ref: 'Classroom', required: false }],
                                school: {type: Schema.Types.ObjectId, ref: 'School', required: false },
                            }, options));

// Child model of the user that represent the supervisors of the system
const Supervisor = User.discriminator("Supervisor",
                        new mongoose.Schema({ 
                            responsability: { type: String, required: false },
                            classes: [{type: Schema.Types.ObjectId, ref: 'Classroom', required: false }],
                        }, options));

module.exports = { Administrator, Student, Teacher, Supervisor, User }