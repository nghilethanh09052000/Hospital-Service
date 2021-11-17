const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors:
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
        });
    }
    return errors;
}


//controler:
const blog_homepage=(req,res)=>{
    res.render('homepage')
}

const login_get=(req,res)=>{
    res.render('login')
}
const login_post= async (req,res)=>{
    const {email,password}=req.body;

    try{
        const user= await User.create( {email, password} );

    }catch{

    }
}


const register_get=(req,res)=>{
    res.render('register')
}
const register_post= async (req,res)=>{
    const { email,password}=req.body;

    try{
        const user= await User.create( {email, password} );
        res.status(201).json(user);
    }catch(err){
        console.log(err);
        res.status(400).send('error, user not created');
    }
}



module.exports = {
    blog_homepage,
    login_get,
    login_post,
    register_get,
    register_post
    
  }