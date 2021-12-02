const mongoose = require('mongoose');
const User = require('./User');
const moment = require('moment-timezone');

const scheduleSchema = new mongoose.Schema({
    hour:String,
    date:{
        type: Date,
        unique:true
    },
    user_id:{
        type: mongoose.Schema.ObjectId,
        ref:User,
        required:true,
        index:true
    },
},{ timestamps: true });

const Schedule = mongoose.model('schedules', scheduleSchema );
module.exports = Schedule;