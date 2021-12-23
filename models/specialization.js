const mongoose = require('mongoose');
const moment = require('moment-timezone');

const specializationSchema = new mongoose.Schema({
    specializations:{
        type:String,
        unique:true
    },
    description:String,
    price:String
   
},{ timestamps: true });

const Specialization = mongoose.model('specializations', specializationSchema );
module.exports = Specialization;