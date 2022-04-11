const User = require('../../models/User');
const Appointment = require('../../models/appointment');
const Specialization = require('../../models/specialization');
const Schedule = require('../../models/schedule');
const medicalForm = require('../../models/medicalForm');
const jwt = require('jsonwebtoken');

const appointmentSpecial_get = async (req,res)=>{
    const id =req.params.id;
    const users = await User.find({specialization_id:id});
    return res.render('./main/patient/appointmentSpecial',
    {users:users,
        title:'Chọn bác sĩ'});
}

const appointmentcalendar_get = async (req,res)=>{
    const id =req.params.id;
    const schedules = await Schedule.find({doctor_id:id}).sort({createdAt:-1}) ;
    return res.render('./main/patient/appointmentcalendar',
    {schedules:schedules,
        title:'Chọn lịch khám'});
}

const appointmentform_get = async (req,res)=>{
    const id =req.params.id;
    const schedule = await Schedule.findById(id);
    const doctor_id = schedule.doctor_id.toString();
    const doctor = await User.findById(doctor_id);
    const specialization = await Specialization.findById(doctor.specialization_id.toString());
    return res.render('./main/patient/appointmentform',
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
                 
                    return res.render('./main/patient/appointmentinfo',{
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

      return  res.render('./main/patient/appointmentdetail',
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
    return res.render('./main/patient/appointmentmedical',
    {medicalforms:medicalforms,
        title:'Đơn thuốc'});
}


const appointmentUpdateInfo_get = (req,res)=>{
    res.render('./main/patient/appointmentUpdateInfo',{title:'Cập nhật tài khoản'});
}

const appointmentUpdateInfo_put = async (req,res)=>{
    const {name,country, phone,facebook,birthday,user_id,gender} = req.body;
    User.findByIdAndUpdate( user_id,  {name,country, phone,facebook,birthday,gender})
    .then(res=>{
        res.json( { redirect:'/appointmentUpdateInfo'} );
    })
    .catch(err=>{
        console.log(err);
    });
}

module.exports = {
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
}
