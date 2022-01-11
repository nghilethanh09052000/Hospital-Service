const express = require('express');
const blogController = require('../controllers/blogController');
const {requireAuth, checkUser , checkLogin, checkPatient,checkDoctor,checkAdmin}= require('../middleware/authMiddleware');

const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
      callback(null, 'HinhAnh/');
    },
  
    //add back the extension
    filename: function (request, file, callback) {
      callback(null, Date.now() + file.originalname);
    },
  });

const upload = multer({
    storage: storage,
    limits: {
      fieldSize: 1024 * 1024 * 3,
    },
  });

  
//router.get('/',blogController.blog_homepage);
//router.get('/appointment',blogController.blog_appointment);

router.get('/GioiThieuChung',blogController.GioiThieuChung_get);
router.get('/benhveda', blogController.benhveda_get);
router.get('/benhvaynen', blogController.benhvaynen_get);
router.get('/benhcham', blogController.benhcham_get);
router.get('/viemdacodia', blogController.viemdacodia_get);
router.get('/benhvayneninfor', blogController.benhvayneninfor_get);
router.get('/benhchaminfor', blogController.benhchaminfor_get);
router.get('/viemdacodiainfor', blogController.viemdacodiainfor_get);
router.get('/biquyetdakhoe', blogController.biquyetdakhoe_get);
router.get('/biquyetdakhoeinfor', blogController.biquyetdakhoeinfor_get);
router.get('/aboutus', blogController.aboutus_get);




router.get('/sendMail', blogController.sendOTP_get);
router.post('/sendMail',blogController.sendOTP_post);
router.get('/adviceMail', blogController.sendAdviceMail_get);
router.post('/adviceMail', blogController.sendAdviceMail_post);
router.get('/login', blogController.login_get);
router.post('/login', blogController.login_post);
router.get('/register', blogController.register_get);
router.post('/register', blogController.register_post);
router.get('/logout', blogController.logout_get);

router.get('/appointmentSpecial/:id',requireAuth,checkLogin,checkPatient,blogController.appointmentSpecial_get);
router.get('/appointmentcalendar/:id',requireAuth,checkLogin,checkPatient,blogController.appointmentcalendar_get);
router.get('/appointmentform/:id',requireAuth,checkLogin,checkPatient,blogController.appointmentform_get);
router.post('/appointmentform',requireAuth,checkLogin,checkPatient,blogController.appointmentform_post);
router.get('/appointmentinfo',requireAuth,checkLogin,checkPatient,blogController.appointmentinfo_get);
router.delete('/appointmentinfo/:id',requireAuth,checkLogin,checkPatient,blogController.appointmentinfo_delete);
router.get('/appointmentdetail/:id',requireAuth,checkLogin,checkPatient,blogController.appointmentdetail_get);
router.get('/appointmentmedicalform/:id',requireAuth,checkLogin,checkPatient,blogController.appointmentmedicalform_get);
router.get('/appointmentUpdateInfo',requireAuth,checkLogin,checkPatient,blogController.appointmentUpdateInfo_get);
router.put('/appointmentUpdateInfo',requireAuth,checkLogin,checkPatient,blogController.appointmentUpdateInfo_put);
router.get('/changepass', blogController.changepass_get);
router.post('/changepass', blogController.changepass_post);


// ------------------------ Doctor Page ------------------------------
router.get('/doctorPageInfo',requireAuth,checkLogin,checkDoctor,blogController.doctorPageInfo_get);
router.put('/doctorPageInfo',requireAuth,checkLogin,checkDoctor,blogController.doctorPageInfo_put);
router.get('/doctorPageInfo',requireAuth,checkLogin,checkDoctor,blogController.doctorPageInfo_get);
router.get('/doctorPageNewAppointment',requireAuth,checkLogin,checkDoctor,blogController.doctorPageNewAppointment_get);
router.get('/doctorPageNewAppointmentDetail/:id',requireAuth,checkLogin,checkDoctor,blogController.doctorPageNewAppointmentDetail_get);
router.put('/doctorPageNewAppointmentDetail',requireAuth,checkLogin,checkDoctor,blogController.doctorPageNewAppointmentDetail_put);

router.get('/doctorPageCompletedAppointment',requireAuth,checkLogin,checkDoctor,blogController.doctorPageCompletedAppointment_get);


router.delete('/doctorPageNewAppointment/:id',requireAuth,checkLogin,checkDoctor,blogController.doctorPageNewAppointment_delete);
router.get('/doctorPageSchedule',requireAuth,checkLogin,checkDoctor,blogController.doctorPageSchedule_get);
router.delete('/doctorPageSchedule/:id',requireAuth,checkLogin,checkDoctor,blogController.doctorPageSchedule_delete);
router.get('/doctorPageScheduleAppointment/:id',requireAuth,checkLogin,checkDoctor,blogController.doctorPageScheduleAppointment_get);
router.put('/updateScheduleBookingSlot',requireAuth,checkLogin,checkDoctor,blogController.updateScheduleBookingSlot_put);
router.get('/doctorPageScheduleAppointmentDetail/:id',requireAuth,checkLogin,checkDoctor,blogController.doctorPageScheduleAppointmentDetail_get);
router.put('/doctorPageScheduleAppointmentDetail',requireAuth,checkLogin,checkDoctor,blogController.doctorPageScheduleAppointmentDetail_put);
router.get('/doctorPageExamination/:id',requireAuth,checkLogin,checkDoctor,blogController.doctorPageExamination_get);
router.post('/doctorPageExaminate',requireAuth,checkLogin,checkDoctor,blogController.doctorPageExamination_post);
router.get('/doctorPageExaminateDetails/:id',requireAuth,checkLogin,checkDoctor,blogController.doctorPageExaminateDetails_get);


router.get('/doctorPageCreateSchedule',requireAuth,checkLogin,checkDoctor,blogController.doctorPageCreateSchedule_get);
router.post('/doctorPageCreateSchedule',requireAuth,checkLogin,checkDoctor,blogController.doctorPageCreateSchedule_post);




// ------------------------ Admin Page ------------------------------
router.get('/adminPageChart',requireAuth,checkLogin, checkAdmin,blogController.adminPageChart_get);
router.get('/adminPageUserAccount',requireAuth,checkLogin, checkAdmin,blogController.adminPageUserAccount_get);
router.get('/adminPageUserAccountDetails/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageUserAccountDetails_get);
router.put('/adminPageUserAccountDetails',requireAuth,checkLogin, checkAdmin,blogController.adminPageUserAccountDetails_put);
router.delete('/adminPageUserAccount/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageUserAccount_delete);
router.get('/adminPageDoctorAccount',requireAuth,checkLogin, checkAdmin,blogController.adminPageDoctorAccount_get);
router.delete('/adminPageDoctorAccount/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageDoctorAccount_delete);
router.get('/adminPageDoctorAccountDetail/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageDoctorAccountDetail_get);
router.put('/adminPageDoctorAccountDetail',requireAuth,checkLogin, checkAdmin,blogController.adminPageDoctorAccountDetail_put);
router.get('/adminPageDoctorAccountDetails/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageDoctorAccountDetails_get);
router.put('/adminPageDoctorAccountDetails',requireAuth,checkLogin, checkAdmin,blogController.adminPageDoctorAccountDetails_put);
router.get('/adminPageCreateSpecialization',requireAuth,checkLogin, checkAdmin,blogController.adminPageCreateSpecialization_get);
router.post('/adminPageCreateSpecialization',requireAuth,checkLogin, checkAdmin,blogController.adminPageCreateSpecialization_post);
router.get('/adminPageSpecialization',requireAuth,checkLogin, checkAdmin,blogController.adminPageSpecialization_get);
router.delete('/adminPageSpecialization/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageSpecialization_delete);
router.get('/adminPageSpecializationDetails/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageSpecializationDetails_get);
router.put('/adminPageSpecialization',requireAuth,checkLogin, checkAdmin,blogController.adminPageSpecialization_put);
router.get('/adminPageCreateClinic',requireAuth,checkLogin, checkAdmin,blogController.adminPageCreateClinic_get);
router.post('/adminPageCreateClinic',requireAuth,checkLogin, checkAdmin,blogController.adminPageCreateClinic_post);
router.get('/adminPageClinic',requireAuth,checkLogin, checkAdmin,blogController.adminPageClinic_get);
router.delete('/adminPageClinic/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageClinic_delete);
router.get('/adminPageAppointment',requireAuth,checkLogin, checkAdmin,blogController.adminPageAppointment_get);
router.get('/adminPageAppointmentDetail/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageAppointmentDetail_get);
router.get('/adminPagePreDetail/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPagePreDetail_get);
router.get('/adminPageDoctorAccountInfo/:id',requireAuth,checkLogin, checkAdmin,blogController.adminPageDoctorAccountInfo_get);


module.exports=router;