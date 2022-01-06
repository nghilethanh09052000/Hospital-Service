const mongoose = require('mongoose');
// const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Specialization = require('./specialization');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique:true,
        lowercase: true,
      },
      password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: [6, 'Nhập mật khẩu ít nhất 6 ký tự'],
      },
     role:{
      type: String,
      enum : ['patient','doctor','admin'],
      default:'patient'
     },
     name:String,
     phone:String,
     facebook:String,
     birthday:Number,
     description:String,
     country:String,
     gender:String,
     specialization_id:{
      type: mongoose.Schema.ObjectId,
      ref:Specialization,
      index:true 
     }

},{ timestamps: true });

//Create function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//check login user with static method:
userSchema.statics.login = async function(email,password){
  const user = await this.findOne({email});
  if(user){
    const auth = await bcrypt.compare(password, user.password);
    if(auth){
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email'); 
};

const User = mongoose.model('users', userSchema);

module.exports = User;
