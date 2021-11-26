const User = require('../models/User');
const otp = require('../models/otp');
const Appointment = require('../models/appointment');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const appointment = require('../models/appointment');

//const bcrypt = require('bcrypt');

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
    if (err.message.includes('users validation failed')) {
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



const register_get=(req,res)=>{
    res.render('register',{title:'Đăng ký'});
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
    res.render('login',{title:'Đăng nhập'})
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

const sendMail_get=(req,res)=>{
    res.render('sendMail', {title:'Quên mật khẩu'} );
}

const sendMail_post =async (req,res)=>{
    const {email}=req.body
    try{
        const data = await User.findOne( {email} );
        console.log(data);
        if(data){
            const otpCode = Math.floor((Math.random()*10000)+1);
            const otpData = await otp.create({
                email:email,
                code:otpCode,
                exprireIn: new Date().getTime()+300*1000
            });
            const token =createToken(otpData._id);
            res.cookie('jwt',token, {httpOnly:true,maxAge:maxAge*1000});
            res.status(201).json({otpData:otpData._id});
            await mailer( otpData.email, otpData.code);
        }else{
            res.status(400).send('error, otp is not createds');
        }
    }catch (err){
        console.log(err);
        res.status(400).send('error, otp is not created');
    }
}

const changePass_get = (req,res)=>{
    res.render('changePass',{title:'Đổi mật khẩu'});
}
const changePass_post = async (req,res)=>{
    const {email,code}=req.body;
    try{
        const data = await otp.find({code:code});
        if(data){
            //const salt = await bcrypt.genSalt();
            const {password} =req.body;
            const user = await User.findOneAndUpdate({email:email},{password:password})
            res.status(200).json();
        }else{
            console.log(err);
            res.status(400).send('User cannot change');
        }
    }catch(err){
        console.log(err);
    }
    
}

const appointment_post= async (req,res)=>{
    
    const {fullname,phone,birthday,gender,service,address,appointmentday,note,user_id }=req.body;
    try{
        const appointment = await Appointment.create({fullname,phone,birthday,gender,service,address,appointmentday,note,user_id});
        res.status(201).json({appointment:appointment._id});
    }catch(err){
        res.status(400).send("No");
    }
    
    
    
 }
const appointmentinfo_get =  (req,res)=>{
    // Appointment.find()
    // .then(result=>{
    //     res.render('appointmentinfo', {appointments:result, title:'Quản lý hồ sơ'});
    // }).catch(err => {
    //     console.log(err);
    //     res.render('404', { title: 'Không tìm thấy trang này' });
    //   });
    res.render('appointmentinfo', {title:'Quản lý hồ sơ'});
}

const GioiThieuChung_get = (req,res)=>{
    res.render('GioiThieuChung',{title:'Giới thiệu chung'});
}

const benhveda_get =(req,res)=>{
    res.render('benhveda',{title:'Bệnh về da'});
}

const userAccount_get =(req,res)=>{
    User.find().then(result=>{
        res.render('userAccount', {users:result,title:"Danh Sách Người Dùng"});
    }).catch(err =>{
        console.log(err);
    });
    
}
// Send Otp with nodemailer:
const mailer = async ( email, code) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:'thanhnghi591@gmail.com',
            pass:'abcABC@123'
        }
    });
    let mailOptions = await transporter.sendMail({
        from: 'thanhnghi591@gmail.com', // sender address
        to:  email, // list of receivers
        subject: "Hello, this is your Otp code ", // Subject line
        text: "YOUR OTP CODE IS: "+ code // plain text body
       // html: code, // html body
      });

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).send(setting.status("User created Successfully, Please Check your Mail"))
        }
      });
      
}

module.exports = {
    login_get,
    login_post,
    register_get,
    register_post,
    logout_get,
    sendMail_get,
    sendMail_post,
    changePass_get,
    changePass_post,
    appointment_post,
    GioiThieuChung_get,
    benhveda_get,
    appointmentinfo_get,
    userAccount_get
}