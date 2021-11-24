const mongoose = require('mongoose');


const appointmentSchema = new mongoose.Schema({
    fullname:String,
    phone:String,
    birthday:Date,
    gender:String,
    service:String,
    appointmentday:Date,
    time:Date,
    note:String
});

const appointment = mongoose.model('appointments', appointmentSchema );
module.exports = appointment;