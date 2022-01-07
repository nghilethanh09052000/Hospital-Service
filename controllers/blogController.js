const User = require('../models/User');
const otp = require('../models/otp');
const Appointment = require('../models/appointment');
const Specialization = require('../models/specialization');
const Schedule = require('../models/schedule');
const Clinic = require('../models/clinic');
const medicalForm = require('../models/medicalForm');

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
      errors.email = 'Email không tồn tại';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'Sai mật khẩu';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'Email này đã được đăng ký';
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

const GioiThieuChung_get = (req,res)=>{
    res.render('GioiThieuChung',{title:'Giới thiệu chung'});
}

const benhveda_get =(req,res)=>{
    res.render('benhveda',{title:'Bệnh về da'});
}
const benhvaynen_get =(req,res)=>{
    res.render('benhvaynen',{title:'thông tin'});
}

const aboutus_get = (req,res)=>{
    res.render('aboutus', {title:'Đội ngũ bác sĩ'});
}




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


//--------------------------- Appointment Role---------------------------------------- 



const appointmentSpecial_get = async (req,res)=>{
    const id =req.params.id;
    const users = await User.find({specialization_id:id});
    return res.render('appointmentSpecial',
    {users:users,
        title:'Chọn bác sĩ'});
}

const appointmentcalendar_get = async (req,res)=>{
    const id =req.params.id;
    const schedules = await Schedule.find({doctor_id:id}).sort({createdAt:-1}) ;
    return res.render('appointmentcalendar',
    {schedules:schedules,
        title:'Chọn lịch khám'});
}

const appointmentform_get = async (req,res)=>{
    const id =req.params.id;
    const schedule = await Schedule.findById(id);
    const doctor_id = schedule.doctor_id.toString();
    const doctor = await User.findById(doctor_id);
    const specialization = await Specialization.findById(doctor.specialization_id.toString());
    return res.render('appointmentform',
    {schedule:schedule,
        doctor:doctor,
        specialization,
        title:'Chọn lịch khám'});
}

const appointmentform_post = async (req,res)=>{
    const {fullname,phone,birthday,gender,address,note,user_id,schedule_id,doctor_id }=req.body;
    try{
        const appointment = await Appointment.create({fullname,phone,birthday,gender,address,note,user_id,schedule_id,doctor_id });
        res.status(201).json({appointment:appointment._id});
       
    }catch(err){
        res.status(400).send("No");
    }
 
}

const appointmentinfo_get = async (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'nghi', async (err,decodedToken)=>{
            if(err){
                console.log(err);
            }else{
                 const user = await User.findById(decodedToken.id);
                 const appointments = await Appointment.find({ user_id:user._id.toString() }).sort({createdAt:-1})
                 
                    return res.render('appointmentinfo',{
                       appointments:appointments,
              
                       title:'Tất cả lịch hẹn'})
               
                }
            })
        }
    }
     
const appointmentinfo_delete = async (req,res)=>{
    const id = req.params.id;
    const appointment = await Appointment.findByIdAndDelete(id);
    if(appointment.status=="Hủy bỏ" || appointment.status=="Chờ xác nhận" ||  appointment.status=="Đã khám"){
        res.json({redirect:'/appointmentinfo'});
    }else if(appointment.status=="Chấp nhận"){
        const schedule = await Schedule.findById(appointment.schedule_id);
        const newBookingSlot = parseInt(schedule.bookingSlot) +1;
        await Schedule.findByIdAndUpdate(schedule._id,{ bookingSlot:newBookingSlot })
        .then(result=>{
            res.json({redirect:'/appointmentinfo'});
        })
        .catch(err=>{
            console.log(err);
        });
    }
  }




const appointmentdetail_get = async (req,res) =>{
    const id =req.params.id;
    const appointment = await Appointment.findById(id);
    const schedule = await Schedule.findById(appointment.schedule_id);
    const doctor = await User.findById(schedule.doctor_id);
    const specialization = await Specialization.findById(doctor.specialization_id);

      return  res.render('appointmentdetail',
      {appointment:appointment,
        schedule:schedule,
        doctor:doctor,
        specialization:specialization,
        title:'Thông tin lịch khám'});
}

const appointmentmedicalform_get = async (req,res)=>{
    const id = req.params.id;
    const appointment = await Appointment.findById(id);
    const medicalforms = await medicalForm.find({appointment_id:appointment._id});
    return res.render('appointmentmedical',
    {medicalforms:medicalforms,
        title:'Đơn thuốc'});
}


const appointmentUpdateInfo_get = (req,res)=>{
    res.render('appointmentUpdateInfo',{title:'Cập nhật tài khoản'});
}

const appointmentUpdateInfo_put = async (req,res)=>{
    const {name,country, phone,facebook,birthday,user_id,gender} = req.body;
    User.findByIdAndUpdate( user_id,  {name,country, phone,facebook,birthday,gender})
    .then(result=>{
        res.json( { redirect:'/appointmentUpdateInfo'} );
    })
    .catch(err=>{
        console.log(err);
    });
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





//-------------------------------------------------- Doctor Page--------------------------------------------------


const  doctorPageInfo_get = (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'nghi', async (err,decodedToken)=>{
            if(err){
                console.log(err);
            }else{
                 const user = await User.findById(decodedToken.id);
                 const doctor_id = user._id.toString()
                 const clinics = await Clinic.find({doctor_id: doctor_id});
                 const specialization = await Specialization.findById(user.specialization_id);
              
                 return res.render('doctorPageInfo',{
                    user:user,
                    specialization:specialization,
                    clinics:clinics,
                    title:'Thông tin Bác Sĩ'})
              }
  
    })
   
}
}

const doctorPageInfo_put = (req,res)=>{
    const {name,country, phone,facebook,birthday,user_id,gender,description} = req.body;
    User.findByIdAndUpdate( user_id,  {name,country, phone,facebook,birthday,gender,description})
    .then(result=>{
        res.json( { redirect:'/doctorPageInfo'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

const doctorPageNewAppointment_get = async (req,res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'nghi', async (err,decodedToken)=>{
            if(err){
                console.log(err);
            }else{
                const doctor = await User.findById(decodedToken.id);
                const appointments = await Appointment.find({doctor_id:doctor._id, status:'Chờ xác nhận'}).sort({createdAt:-1});
                return res.render('doctorpagenewapp',{
                    appointments:appointments,
                    title:'Lịch hẹn mới'})
                }
                })
}
}

const doctorPageNewAppointmentDetail_get = async (req,res )=>{
    const id =req.params.id;
    const appointment = await Appointment.findById(id);
    const schedule = await Schedule.findById(appointment.schedule_id);
    const doctor = await User.findById(schedule.doctor_id);
    const userId = await User.findById(appointment.user_id);
    const specialization = await Specialization.findById(doctor.specialization_id);
    return  res.render('doctorpagenewappdetail',
      {appointment:appointment,
        schedule:schedule,
        doctor:doctor,
        userId:userId,
        specialization:specialization,
        title:'Thông tin lịch khám'});
}

const doctorPageNewAppointmentDetail_put = async (req,res)=>{
    const {appointment_id,status}= req.body;
    if(status=="Hủy bỏ"){
    await Appointment.findByIdAndUpdate( appointment_id, {status})
    .then(result=>{
        res.json( { redirect:'/doctorPageNewAppointment'} );
    }).catch(err=>{
        console.log(err);
    })
    }else if(status=="Chấp nhận"){
    const appointment = await Appointment.findByIdAndUpdate( appointment_id, {status});
    const schedule = await Schedule.findById(appointment.schedule_id);
    const newBookingSlot = parseInt(schedule.bookingSlot) -1;
    await Schedule.findByIdAndUpdate(schedule._id,{ bookingSlot:newBookingSlot })
  .then(result=>{
     res.json( { redirect:'/doctorPageNewAppointment'} );
 }).catch(err=>{
     console.log(err);
 })
   }
        
 
}

   
const doctorPageCompletedAppointment_get = async (req, res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'nghi', async (err,decodedToken)=>{
            if(err){
                console.log(err);
            }else{
                const doctor = await User.findById(decodedToken.id);
                const appointments = await Appointment.find({doctor_id:doctor._id, status:'Đã khám'}).sort({createdAt:-1});
                return res.render('doctorpagecomapp',{
                    appointments:appointments,
                    title:'Khám bệnh'})
                }
                })
}
}


const doctorPageNewAppointment_delete = (req,res)=>{
    const id = req.params.id;
    Appointment.findByIdAndDelete(id).
    then(result=>{
        res.json( { redirect:'/doctorPageNewAppointment'} );
    })
    .catch(err=>{
        console.log(err);
    });
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

const doctorPageScheduleAppointment_get = async (req,res)=>{
    const id =req.params.id;
    const schedule = await Schedule.findById(id);
    const appointments = await Appointment.find({schedule_id:schedule._id,$or:
                                                                            [
                                                                                {status:'Chấp nhận'},
                                                                            {status:'Đã khám' } 
                                                                        ]
                                                                    }       
                                                                ).sort({createdAt:-1})
    return res.render('docpagescheduleapp',{
        schedule:schedule,
        appointments:appointments,
        title:'Lịch làm việc'});
    
}


const updateScheduleBookingSlot_put = async (req,res)=>{
    const {bookingSlot,schedule_id} = req.body;
    const schedule= await Schedule.findByIdAndUpdate(schedule_id, {bookingSlot:bookingSlot})
    
     return  res.json( { redirect:`/doctorPageScheduleAppointment/${schedule._id}`} );
    
}

const doctorPageScheduleAppointmentDetail_get = async (req,res)=>{
    const id =req.params.id;
    const appointment = await Appointment.findById(id);
    const schedule = await Schedule.findById(appointment.schedule_id);
    const doctor = await User.findById(schedule.doctor_id);
    const specialization = await Specialization.findById(doctor.specialization_id);
    const patient = await User.findById(appointment.user_id);
      return  res.render('docpagescheduleappdetail',
      {appointment:appointment,
        schedule:schedule,
        doctor:doctor,
        specialization:specialization,
        patient:patient,
        title:'Thông tin lịch khám'});
}

const doctorPageScheduleAppointmentDetail_put = async (req,res)=>{
    const {appointment_id,status}= req.body;
   
    const appointment = await Appointment.findByIdAndUpdate( appointment_id, {status})
    const schedule = appointment.schedule_id
     return  res.json( { redirect:`/doctorPageScheduleAppointment/${schedule._id} `} );

   
}


const doctorPageExamination_get = async (req,res) =>{
    const id =req.params.id;
    await Appointment.findById(id)
    .then(result =>{
        res.render('doctorpageexam',{appointment:result,title:'Tiến hành khám bệnh'});
    })
    .catch(err =>{
        console.log(err);
    })
}

const doctorPageExamination_post = async (req,res)=>{
    const {diagnose,symptoms,description,prescription,doctorAdvice,appointment_id}=req.body;
    const medicalform = await medicalForm.create({diagnose,symptoms,description,prescription,doctorAdvice,appointment_id});
    const appointments = medicalform.appointment_id;
    const appointment = await Appointment.findById(appointments._id)
    const schedule = appointment.schedule_id;
   
    return  res.json( { redirect:`/doctorPageScheduleAppointment/${schedule._id} `} );
 
  
}


const doctorPageExaminateDetails_get = async (req,res)=>{
    const id = req.params.id;
    const appointment = await Appointment.findById(id);
    const medicalforms = await medicalForm.find({appointment_id:appointment._id});
    const schedule =  await Schedule.findById(appointment.schedule_id); 
    return res.render('doctorpageexaminatedetail',
    {medicalforms:medicalforms,schedule:schedule,
        title:'Đơn thuốc'});
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
    const {hour,date,doctor_id} = req.body;
    try{
        const schedule = await Schedule.create({hour,date, doctor_id});
        res.status(201).json({schedule:schedule._id});
    }catch(err){
        res.status(400).send("No");
    }
}
//-------------------------------- Admin ---------------------------------------
const adminPageChart_get= async (req,res)=>{
    const specializationsName = await Specialization.find();
    const doctors = await User.find({role:'doctor'});
    const patients = await User.find({role:'patient'});
    const appointments = await Appointment.find();
    const comAppointments = await Appointment.find({status:'Đã khám'})
    res.render('adminPageChart',{
        specializationsName:specializationsName,
        doctors:doctors,
        patients:patients,
        appointments:appointments,
        comAppointments: comAppointments,
    
   title:'Biểu đồ' })
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
     User.find({role:role}).sort({createdAt:-1})
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

const adminPageDoctorAccountDetails_get = async (req,res)=>{
    const id =req.params.id;
    const user = await User.findById(id);
    const clinics =  await Clinic.find({doctor_id: null});
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





const adminPageCreateSpecialization_get = (req,res)=>{
    res.render('adminPageCreateSpecialization',{title:'Tạo mới chuyên khoa'});
}

const adminPageCreateSpecialization_post = async (req,res)=>{
 
    const {specializations,description,price}=req.body;
    try{
        const specialization = await Specialization.create({specializations,description,price} );
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



const adminPageSpecialization_put =  (req,res)=>{
    const {specializations_id, description,price} = req.body;
    Specialization.findByIdAndUpdate(specializations_id, {description:description,price:price})
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

const adminPageClinic_get = (req,res)=>{
    Clinic.find()
    .then(result=>{
        res.render('adminPageClinic',{ clinics:result,title:'Thông tin phòng khám'});
    })
    .catch(err =>{
        res.render('404', { title: 'Trang không tìm thấy' });
    })

    
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

const adminPageAppointment_get = async (req,res)=>{
    const appointments = await Appointment.find().sort({createdAt:-1});
    return res.render('adminPageAppointment',{appointments:appointments,title:'Lịch hẹn bệnh nhân'});
}


const adminPageAppointmentDetail_get = async (req,res)=>{
    const id =req.params.id;
    const appointment = await Appointment.findById(id);
    const schedule = await Schedule.findById(appointment.schedule_id);
    const doctor = await User.findById(schedule.doctor_id);
    const specialization = await Specialization.findById(doctor.specialization_id);
 
      return  res.render('adminPageAppointmentDetail',
      {appointment:appointment,
        schedule:schedule,
        doctor:doctor,
        specialization:specialization,
        title:'Thông tin lịch khám bênh nhân'});

}

const adminPagePreDetail_get = async (req,res)=>{
    const id = req.params.id;
    const appointment = await Appointment.findById(id);
    const medicalforms = await medicalForm.find({appointment_id:appointment._id});
    return res.render('adminPagePreDetail',
    {medicalforms:medicalforms,
        title:'Đơn thuốc'});
}

const adminPageDoctorAccountInfo_get = async (req,res)=>{
   const id = req.params.id;
   const doctor= await User.findById(id);
   const clinics = await Clinic.find({ doctor_id:doctor._id });
   const specialization = await Specialization.findById(doctor.specialization_id);
   const appointments = await Appointment.find({doctor_id:doctor._id,$or:
                                                                        [
                                                                            {status:'Đã khám' } 
                                                                        ]                  
                                                                    })
   return res.render('adminPageDoctorInfo',{
    doctor:doctor,
      specialization:specialization,
      clinics:clinics,
      appointments:appointments,
      title:'Thông tin Bác Sĩ'})


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
    GioiThieuChung_get,
    benhveda_get,
<<<<<<< HEAD
    benhvaynen_get,
=======
    aboutus_get,

>>>>>>> d2a1b15f794701c08878a4798a274271d88d7dd0


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
 
    appointmentSpecial_get,
    appointmentcalendar_get,
    appointmentform_get,
    appointmentform_post,
    appointmentinfo_get,
    appointmentinfo_delete,
    appointmentdetail_get,
    appointmentmedicalform_get,
    appointmentUpdateInfo_get,
    appointmentUpdateInfo_put,
    
    doctorPageInfo_get,
    doctorPageInfo_put,
    doctorPageNewAppointment_get,
    doctorPageNewAppointmentDetail_get,
    doctorPageNewAppointmentDetail_put,
    doctorPageCompletedAppointment_get,

    doctorPageNewAppointment_delete,
    doctorPageCreateSchedule_get,
    doctorPageCreateSchedule_post,
    doctorPageSchedule_get,
    doctorPageSchedule_delete,
    doctorPageScheduleAppointment_get,
    updateScheduleBookingSlot_put,
    doctorPageScheduleAppointmentDetail_get,
    doctorPageScheduleAppointmentDetail_put,
    doctorPageExamination_get,
    doctorPageExamination_post,
    doctorPageExaminateDetails_get,
    adminPageChart_get,
    adminPageUserAccount_get,
    adminPageUserAccountDetails_get,
    adminPageUserAccountDetails_put,
    adminPageUserAccount_delete,
    adminPageDoctorAccount_get,
    
    adminPageDoctorAccountDetail_get,
    adminPageDoctorAccountDetail_put,
    adminPageDoctorAccountDetails_get,
    adminPageDoctorAccountDetails_put,

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
    adminPageClinic_delete,
    adminPageAppointment_get,
    adminPageAppointmentDetail_get,
    adminPagePreDetail_get,
    adminPageDoctorAccountInfo_get
}