const User = require('../../models/User');
const Appointment = require('../../models/appointment');
const Specialization = require('../../models/specialization');
const Schedule = require('../../models/schedule');
const Clinic = require('../../models/clinic');
const medicalForm = require('../../models/medicalForm');

const jwt = require('jsonwebtoken');


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
              
                 return res.render('./main/doctor/doctorPageInfo',{
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
                return res.render('./main/doctor/doctorpagenewapp',{
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
    return  res.render('./main/doctor/doctorpagenewappdetail',
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
                return res.render('./main/doctor/doctorpagecomapp',{
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
                    res.render('./main/doctor/doctorPageSchedule',{schedules:result, title:'Lịch làm việc'});
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
    return res.render('./main/doctor/docpagescheduleapp',{
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
      return  res.render('./main/doctor/docpagescheduleappdetail',
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
        res.render('./main/doctor/doctorpageexam',{appointment:result,title:'Tiến hành khám bệnh'});
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
    return res.render('./main/doctor/doctorpageexaminatedetail',
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
                return res.render('./main/doctor/doctorPageCreateSchedule',
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

module.exports = {
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
}