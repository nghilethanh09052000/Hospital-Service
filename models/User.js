const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        // validate: [isEmail, 'Please enter a valid email']
      },
      password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
      }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;