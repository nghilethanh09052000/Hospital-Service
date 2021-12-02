const mongoose = require('mongoose');

const medicalFormSchema = new mongoose.Schema({
    symtomps:String
})


const medicalForm = mongoose.model(' medicalForms', medicalFormSchema );
module.exports =  medicalForm;