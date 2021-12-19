const mongoose = require('mongoose');
const User = require('./User');
const Clinic = require('./clinic');

const moment = require('moment-timezone');

const scheduleSchema = new mongoose.Schema({
    hour:{
        type:String,
        required:true,
    },
    date:{
       type:Date,
       required:true
    },
    doctor_id:{
        type: mongoose.Schema.ObjectId,
        ref:User,
        required:true,
        index:true
    },
    bookingSlot:{
        type:String,
        default:'Còn chỗ'
    }
    
},{ timestamps: true });

const Schedule = mongoose.model('schedules', scheduleSchema );
module.exports = Schedule;