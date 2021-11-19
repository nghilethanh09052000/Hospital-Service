const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors:
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not existed';
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
    if (err.message.includes('Users validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//Create JWT:
const maxAge= 3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},'nghi',{
        expiresIn:maxAge
    });
};


//controler:
const blog_homepage=(req,res)=>{
    res.render('homepage')
}
const blog_appointment=(req,res)=>{
    res.render('appointment')
}

const register_get=(req,res)=>{
    res.render('register')
}

const register_post= async (req,res)=>{
    const { email,password}=req.body;
    try{
        const user= await User.create( {email, password} );
        const token =createToken(user._id);
        res.cookie('jwt',token, {httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user:user._id});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const login_get=(req,res)=>{
    res.render('login')
}

const login_post= async (req,res)=>{
    const { email,password}=req.body;

    try{
        const user= await User.login(email, password);
        const token =createToken(user._id);
        res.cookie('jwt',token, {httpOnly:true,maxAge:maxAge*1000});
        res.status(200).json( {user:user._id} );
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}






module.exports = {
    blog_homepage,
    blog_appointment,
    login_get,
    login_post,
    register_get,
    register_post,
    logout_get
    
  }