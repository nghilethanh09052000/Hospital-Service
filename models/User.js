const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique:true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
      },
      password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
      }
});

//Create function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Create function after doc saved to db
userSchema.post('save',async function(doc,next){
  console.log('new user was created & saved',doc)
  next();
})

const User = mongoose.model('Users', userSchema);
module.exports = User;