const mongoose = require('mongoose');
const { isEmail } = require('validator');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique:true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
      },
    code:String,
    exprireIn:Number
});

const otp = mongoose.model('otps',otpSchema);
module.exports= otp;

