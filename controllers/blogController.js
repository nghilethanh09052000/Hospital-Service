const User = require('../models/User');
const otp = require('../models/otp');
const Appointment = require('../models/appointment');
const Specialization = require('../models/specialization');
const Schedule = require('../models/schedule');
const Clinic = require('../models/clinic');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


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
        const role = user.role;
        if(role=='patient'){
            const user = await User.findOne({email,role});
            res.status(200).json( {user:user._id} );
        }else if(role =='doctor'){
            const user1 = await User.findOne({email,role});
            res.status(200).json( {user1:user._id} );
        }else{
            const user2 = await User.findOne({email,role});
            res.status(200).json( {user2:user._id} );
        }
            
        
        
        
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

const sendOTP_get=(req,res)=>{
    res.render('sendMail', {title:'Quên mật khẩu'} );
}

const sendOTP_post =async (req,res)=>{
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

const sendAdviceMail_get = (req,res)=>{
    res.render('adviceMail',{title:'Nhận tư vấn'});
}

const sendAdviceMail_post = async (req,res)=>{
    const {email,fullname,phone,address,note}=req.body;

    try{
        res.status(201).json({email,fullname,phone,address,note});
        adviceMail(email,note);
        backadviceMail(email);
    }catch(err){
        res.status(400).send('Mail does not send');  
    }
}


const changepass_get = (req,res)=>{
    res.render('changePass',{title:'Đổi mật khẩu'});
}
 const changepass_post = async (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'nghi', async (err,decodedToken)=>{
            if(err){
                console.log(err);
            }else{
                try{
                    const user_id = await User.findById(decodedToken.id);
                    const salt = await bcrypt.genSalt();
                    const password = await bcrypt.hash(req.body.password, salt);
                    const user = await User.findByIdAndUpdate( {_id:user_id},{password:password});
                    res.status(201).json({user:user._id});
                }catch(err){
                    res.status(400).send("No");
                }
            }
        })
    }
}
const appointment_post= async (req,res)=>{
    
    const {fullname,phone,birthday,gender,service,address,appointmentday,note,user_id,status}=req.body;
    try{
        const appointment = await Appointment.create({fullname,phone,birthday,gender,service,address,appointmentday,note,user_id,status});
        res.status(201).json({appointment:appointment._id});
    }catch(err){
        res.status(400).send("No");
    }
    
    
    
 }

const appointmentinfo_get =  (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'nghi', async (err,decodedToken)=>{
            if(err){
                console.log(err);
            }else{
                const user_id = await User.findById(decodedToken.id);
                Appointment.find( {user_id:user_id._id } ).sort({appointmentday:-1})
                    .then(result =>{
                        res.render('appointmentinfo', {appointments:result ,title:'Quản lý hồ sơ'});
                    })
                    .catch(err =>{
                        console.log(err);
                        res.render('404', { title: 'Trang không tìm thấy' });
                    })
                
            }
        })
    }else{
        res.render('404', { title: 'Trang không tìm thấy' });
    }
}

const appointmentinfo_delete = (req,res)=>{
    const id = req.params.id;
    Appointment.findByIdAndDelete(id).
    then(result=>{
        res.json( { redirect:'/appointmentinfo'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

const appointmentdetail_get = (req,res) =>{
    const id =req.params.id;
    Appointment.findById(id)
    .then(result =>{
        res.render('appointmentdetail',{appointment:result ,title:'Thông tin chi tiết'});
    })
    .catch(err =>{
        res.render('404', { title: 'Trang không tìm thấy' });
    })
}

const GioiThieuChung_get = (req,res)=>{
    res.render('GioiThieuChung',{title:'Giới thiệu chung'});
}

const benhveda_get =(req,res)=>{
    res.render('benhveda',{title:'Bệnh về da'});
}

const userAccount_get =  (req,res)=>{
     User.find().then(result=>{
        res.render('userAccount', {users:result,title:"Danh Sách Người Dùng"});
    }).catch(err =>{
        console.log(err);
    });
    
}

const adminPageUserAccount_get = (req,res)=>{
    const role = 'patient'
 User.find({role:role}).sort({createdAt:-1})
    .then(result =>{
        res.render('adminPageUserAccount',{users:result, title:'Quản lý bệnh nhân'});
    })
    .catch(err =>{
        console.log(err);
    })
}

const adminPageUserAccount_delete = (req,res) =>{
    const id = req.params.id;
    User.findByIdAndDelete(id).
    then(result=>{
        res.json( { redirect:'/adminPageUserAccount'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

const adminPageUserAccountDetails_get =(req,res)=>{
    const id =req.params.id;
    User.findById(id)
    .then(result =>{
        res.render('adminPageUserAccountDetails',{user:result ,title:'Thông tin tài khoản'});
    })
    .catch(err =>{
        res.render('404', { title: 'Trang không tìm thấy' });
    })
}

const adminPageUserAccountDetails_put = (req,res)=>{
    const {role,user_id} = req.body;
    User.findByIdAndUpdate(user_id, {role:role})
    .then(result=>{
        res.json( { redirect:'/adminPageUserAccount'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

const adminPageDoctorAccount_get =  (req,res)=>{
    const role = 'doctor'
     User.find({role:role})
    .then(result =>{
        res.render('adminPageDoctorAccount',{users:result, title:'Quản lý Bác Sĩ'});
    })
    .catch(err =>{
        res.render('404', { title: 'Trang không tìm thấy' });
    })
}

const adminPageDoctorAccount_delete = (req,res)=>{
    const id = req.params.id;
    User.findByIdAndDelete(id).
    then(result=>{
        res.json( { redirect:'/adminPageDoctorAccount'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

const adminPageDoctorAccountDetails_get = async (req,res)=>{
    const id =req.params.id;
    const user = await User.findById(id);
    const clinics =  await Clinic.find();
    return res.render('adminPageDoctorAccountDetails',
    {user:user,clinics :clinics ,
        title:'Phân phòng khám'});
}

const adminPageDoctorAccountDetails_put = async (req,res)=>{
    const {clinic,user_id} = req.body;
    const doctor_id= await User.findById(user_id);

    Clinic.findOneAndUpdate( {name:clinic} , {doctor_id:doctor_id })
    .then(result=>{
        res.json( { redirect:'/adminPageDoctorAccount'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

const adminPageDoctorAccountDetail_get = async (req,res)=>{
    const id =req.params.id;
    const user = await User.findById(id);
    const specializations =  await Specialization.find();
    return res.render('adminPageDoctorAccountDetail',
    {user:user,specializations :specializations ,
        title:'Phân chuyên khoa'});

}

const adminPageDoctorAccountDetail_put= async (req,res)=>{
    const {specializations,user_id} = req.body;
    const specialization = await Specialization.findOne({specializations:specializations});
    User.findByIdAndUpdate(user_id, {specialization_id:specialization._id})
    .then(result=>{
        res.json( { redirect:'/adminPageDoctorAccount'} );
    })
    .catch(err=>{
        console.log(err);
    });
}



const adminPageCreateSpecialization_get = (req,res)=>{
    res.render('adminPageCreateSpecialization',{title:'Tạo mới chuyên khoa'});
}

const adminPageCreateSpecialization_post = async (req,res)=>{
    const {specializations,description,image}=req.body;
    try{
        const specialization = await Specialization.create({specializations,description,image});
        res.status(201).json({specialization:specialization._id});
    }catch(err){
        res.status(400).send("No");

    }

}

const adminPageSpecialization_get =(req,res)=>{
    Specialization.find()
    .then(result=>{
        res.render('adminPageSpecialization',{specializations:result ,title:'Các chuyên khoa'});
    })
    .catch(err =>{
        res.render('404', { title: 'Trang không tìm thấy' });
    })
}

const adminPageSpecializationDetails_get = (req,res)=>{
    const id =req.params.id;
    Specialization.findById(id)
    .then(result =>{
        res.render('adminPageSpecializationDetails',{specializations:result ,title:'Thông tin chi tiết'});
    })
    .catch(err =>{
        res.render('404', { title: 'Trang không tìm thấy' });
    })
}

const adminPageSpecialization_delete = (req,res)=>{
    const id = req.params.id;
    Specialization.findByIdAndDelete(id).
    then(result=>{
        res.json( { redirect:'/adminPageSpecialization'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

const adminPageSpecialization_put =  (req,res)=>{
    const {specializations_id, description,image} = req.body;
    Specialization.findByIdAndUpdate(specializations_id, {image:image,description:description})
    .then(result=>{
        res.json( { redirect:'/adminPageSpecialization'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

const adminPageCreateClinic_get = (req,res)=>{
    res.render('adminPageCreateClinic',{title:'Thêm phòng khám'});
}

const adminPageCreateClinic_post = async (req,res)=>{
    const {name} = req.body;
    try{
        const clinic = await Clinic.create({name});
        res.status(201).json({clinic:clinic._id});
    }catch(err){
        res.status(400).send("No");
    }
}

const adminPageClinic_get = async (req,res)=>{
    const clinics = await Clinic.find();
    return res.render('adminPageClinic',
    { clinics:clinics,
        title:'Thông tin phòng khám'});

    
}

const adminPageClinic_delete = (req,res)=>{
    const id = req.params.id;
    Clinic.findByIdAndDelete(id).
    then(result=>{
        res.json( { redirect:'/adminPageClinic'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

const   doctorPageInfo_get = (req,res)=>{
    res.render('doctorPageInfo',{title:'Thông tin cá nhân'})
}

const doctorPageSchedule_get = (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'nghi', async (err,decodedToken)=>{
            if(err){
                console.log(err);
            }else{
                const doctor_id = await User.findById(decodedToken.id);
                Schedule.find({doctor_id}).sort({createdAt:-1})
                .then(result =>{
                    res.render('doctorPageSchedule',{schedules:result, title:'Lịch làm việc'});
                })
                .catch(err =>{
                    res.render('404', { title: 'Trang không tìm thấy' })
                })
    }
})
    }
    
}

const doctorPageSchedule_delete = (req,res) =>{
    const id = req.params.id;
    Schedule.findByIdAndDelete(id).
    then(result=>{
        res.json( { redirect:'/doctorPageSchedule'} );
    })
    .catch(err=>{
        console.log(err);
    });
}


const doctorPageCreateSchedule_get = async (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'nghi', async (err,decodedToken)=>{
            if(err){
                console.log(err);
            }else{
                const doctorId = await User.findById(decodedToken.id);
                const doctor_id = doctorId._id.toString()
                const clinics = await Clinic.find( { doctor_id: doctor_id });
                return res.render('doctorPageCreateSchedule',
                {clinics:clinics,
                    title:'Thêm lịch làm việc'});
    }
})
    }
    
    
}

const doctorPageCreateSchedule_post =async (req,res) =>{
    const {hour,date,doctor_id,clinic_id} = req.body;
    try{
        const schedule = await Schedule.create({hour,date, doctor_id,clinic_id});
        res.status(201).json({schedule:schedule._id});
    }catch(err){
        res.status(400).send("No");
    }
}

// Send Otp with nodemailer:
const mailer = async ( email, code) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:'thanhnghi591@gmail.com',
            pass:'abcABC@123456'
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

// Send adviceMail: 
const adviceMail = async ( email, note) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:'thanhnghi591@gmail.com',
            pass:'abcABC@123456'
        }
    });
    let mailOptions = await transporter.sendMail({
        from: email, // sender address
        to:  'thanhnghi591@gmail.com' , // list of receivers
        subject: "Hello, ", // Subject line
        text: note // plain text body
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

// Send back adviceMail: 
const backadviceMail = async (email) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:'thanhnghi591@gmail.com',
            pass:'abcABC@123456'
        }
    });
    let mailOptions = await transporter.sendMail({
        from: 'thanhnghi591@gmail.com', // sender address
        to:  email , // list of receivers
        subject: "Hello, ", // Subject line
        text: "We have receive your question"// plain text body
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
    sendOTP_get,
    sendOTP_post,
    sendAdviceMail_get,
    sendAdviceMail_post,
    changepass_get, 
    changepass_post,
    appointment_post,
    appointmentinfo_get,
    appointmentinfo_delete,
    appointmentdetail_get,
    GioiThieuChung_get,
    benhveda_get,
    userAccount_get,

    doctorPageInfo_get,
    doctorPageCreateSchedule_get,
    doctorPageCreateSchedule_post,
    doctorPageSchedule_get,
    doctorPageSchedule_delete,
    adminPageUserAccount_get,
    adminPageUserAccountDetails_get,
    adminPageUserAccountDetails_put,
    adminPageUserAccount_delete,
    adminPageDoctorAccount_get,
    adminPageDoctorAccountDetail_get,
    adminPageDoctorAccountDetails_get,
    adminPageDoctorAccountDetails_put,
    adminPageDoctorAccountDetail_put,
    adminPageDoctorAccount_delete,
    adminPageSpecialization_get,
    adminPageSpecialization_delete,
    adminPageSpecializationDetails_get,
    adminPageSpecialization_put,
    adminPageCreateSpecialization_get,
    adminPageCreateSpecialization_post,
    adminPageCreateClinic_get,
    adminPageCreateClinic_post,
    adminPageClinic_get,
    adminPageClinic_delete
}