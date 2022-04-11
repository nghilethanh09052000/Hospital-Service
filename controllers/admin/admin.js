const User = require('../../models/User');
const Appointment = require('../../models/appointment');
const Specialization = require('../../models/specialization');
const Schedule = require('../../models/schedule');
const Clinic = require('../../models/clinic');
const medicalForm = require('../../models/medicalForm');

const adminPageChart_get= async (req,res)=>{
    const specializationsName = await Specialization.find();
    const doctors = await User.find({role:'doctor'});
    const patients = await User.find({role:'patient'});
    const appointments = await Appointment.find();
    const comAppointments = await Appointment.find({status:'Đã khám'})
    res.render('./main/admin/adminPageChart',{
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
        res.render('./main/admin/adminPageUserAccount',{users:result, title:'Quản lý bệnh nhân'});
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
        res.render('./main/admin/adminPageUserAccountDetails',{user:result ,title:'Thông tin tài khoản'});
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
        res.render('./main/admin/adminPageDoctorAccount',{users:result, title:'Quản lý Bác Sĩ'});
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
    return res.render('./main/admin/adminPageDoctorAccountDetail',
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
    return res.render('./main/admin/adminPageDoctorAccountDetails',
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



const adminPageAdminAccount_get =async (req,res)=>{
    res.render('./main/admin/adminupdate',{title:'Cập nhật thông tin'});
}

const adminPageAdminAccount_put =async (req,res)=>{
    const {name,country,facebook,user_id} = req.body; 
    User.findByIdAndUpdate( user_id , {name,country,facebook })
    .then(result=>{
        res.json( { redirect:'/adminPageAdminAccount'} );
    })
    .catch(err=>{
        console.log(err);
    });
}


const adminPageCreateSpecialization_get = (req,res)=>{
    res.render('./main/admin/adminPageCreateSpecialization',{title:'Tạo mới chuyên khoa'});
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
        res.render('./main/admin/adminPageSpecialization',{specializations:result ,title:'Các chuyên khoa'});
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
        res.render('./main/admin/adminPageSpecializationDetails',{specializations:result ,title:'Thông tin chi tiết'});
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
    res.render('./main/admin/adminPageCreateClinic',{title:'Thêm phòng khám'});
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
        res.render('./main/admin/adminPageClinic',{ clinics:result,title:'Thông tin phòng khám'});
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
    return res.render('./main/admin/adminPageAppointment',{appointments:appointments,title:'Lịch hẹn bệnh nhân'});
}


const adminPageAppointmentDetail_get = async (req,res)=>{
    const id =req.params.id;
    const appointment = await Appointment.findById(id);
    const schedule = await Schedule.findById(appointment.schedule_id);
    const doctor = await User.findById(schedule.doctor_id);
    const specialization = await Specialization.findById(doctor.specialization_id);
 
      return  res.render('./main/admin/adminPageAppointmentDetail',
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
    return res.render('./main/admin/adminPagePreDetail',
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
   return res.render('./main/admin/adminPageDoctorInfo',{
    doctor:doctor,
      specialization:specialization,
      clinics:clinics,
      appointments:appointments,
      title:'Thông tin Bác Sĩ'})


}

module.exports = {
    adminPageChart_get,
    adminPageUserAccount_get,
    adminPageUserAccountDetails_get,
    adminPageUserAccountDetails_put,
    adminPageUserAccount_delete,
    adminPageDoctorAccount_get,
    adminPageAdminAccount_put,
    adminPageDoctorAccountDetail_get,
    adminPageDoctorAccountDetail_put,
    adminPageDoctorAccountDetails_get,
    adminPageDoctorAccountDetails_put,
    adminPageDoctorAccount_delete,
    adminPageAdminAccount_get,
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