const express = require('express');
const doctorController = require('../../controllers/doctor/doctor');
const {requireAuth, checkLogin, checkDoctor}= require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/doctorPageInfo',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageInfo_get);
router.put('/doctorPageInfo',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageInfo_put);
router.get('/doctorPageInfo',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageInfo_get);
router.get('/doctorPageNewAppointment',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageNewAppointment_get);
router.get('/doctorPageNewAppointmentDetail/:id',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageNewAppointmentDetail_get);
router.put('/doctorPageNewAppointmentDetail',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageNewAppointmentDetail_put);
router.get('/doctorPageCompletedAppointment',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageCompletedAppointment_get);
router.delete('/doctorPageNewAppointment/:id',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageNewAppointment_delete);
router.get('/doctorPageSchedule',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageSchedule_get);
router.delete('/doctorPageSchedule/:id',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageSchedule_delete);
router.get('/doctorPageScheduleAppointment/:id',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageScheduleAppointment_get);
router.put('/updateScheduleBookingSlot',requireAuth,checkLogin,checkDoctor,doctorController.updateScheduleBookingSlot_put);
router.get('/doctorPageScheduleAppointmentDetail/:id',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageScheduleAppointmentDetail_get);
router.put('/doctorPageScheduleAppointmentDetail',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageScheduleAppointmentDetail_put);
router.get('/doctorPageExamination/:id',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageExamination_get);
router.post('/doctorPageExaminate',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageExamination_post);
router.get('/doctorPageExaminateDetails/:id',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageExaminateDetails_get);
router.get('/doctorPageCreateSchedule',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageCreateSchedule_get);
router.post('/doctorPageCreateSchedule',requireAuth,checkLogin,checkDoctor,doctorController.doctorPageCreateSchedule_post);



module.exports=router;
