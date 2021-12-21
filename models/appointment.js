const mongoose = require('mongoose');
const User = require('./User');
const Schedule = require('./schedule');


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
    },
    doctor_id:{
        type: mongoose.Schema.ObjectId,
        ref:User,
        required:true,
        index:true
    },
    status:{
        type:String,
        default:'Chờ xác nhận'
    }
},{ timestamps: true });

const Appointment = mongoose.model('appointments', appointmentSchema );
module.exports = Appointment;