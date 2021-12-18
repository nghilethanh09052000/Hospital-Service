const mongoose = require('mongoose');
const User = require('./User');
const Schedule = require('./schedule');

const medicalForm = require('./medicalForm');
const moment = require('moment-timezone');

const dateVietNam = moment.tz(Date.now(), "Asia/Tokyo");
const appointmentSchema = new mongoose.Schema({
    fullname:String,
    phone:String,
    birthday:Date,
    gender:String,
    address:String,
  
    note:String,
  
    schedule_id:{
        type: mongoose.Schema.ObjectId,
        ref:Schedule,
        required:true,
        index:true
    },
    user_id:{
        type: mongoose.Schema.ObjectId,
        ref:User,
        required:true,
        index:true
    }
},{ timestamps: true });

const Appointment = mongoose.model('appointments', appointmentSchema );
module.exports = Appointment;