const mongoose = require('mongoose');
const User = require('./User');
const moment = require('moment-timezone');

const specializationSchema = new mongoose.Schema({
    specializations:String,
    description:String,
    image:String,
    user_id:{
        type: mongoose.Schema.ObjectId,
        ref:User,
        required:true,
        index:true,
        unique:true
    },
},{ timestamps: true });

const Specialization = mongoose.model('specializations', specializationSchema );
module.exports = Specialization;