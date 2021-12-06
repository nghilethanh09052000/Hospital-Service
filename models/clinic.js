const mongoose = require('mongoose');
const User = require('./User');

const clinicSchema= new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    doctor_id:{
        type: mongoose.Schema.ObjectId,
        ref:User,
        index:true
    }
},{ timestamps: true });

const Clinic = mongoose.model('clinics', clinicSchema );
module.exports = Clinic;