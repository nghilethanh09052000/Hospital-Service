const mongoose = require('mongoose');
const User = require('./User');
const moment = require('moment-timezone');

const specializationSchema = new mongoose.Schema({
    specializations:{
        type:String,
        unique:true
    },
    description:String,
    image:String,
    address:{
        type:String,
        default:'Số 669 Quốc lộ 1, Khu phố 3, Phường Linh Xuân, Thủ Đức, TP. Hồ Chí Minh'
    },
    price:String
   
},{ timestamps: true });

const Specialization = mongoose.model('specializations', specializationSchema );
module.exports = Specialization;