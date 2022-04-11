const express = require('express');
const patientController = require('../../controllers/patient/patient');
const {requireAuth, checkLogin, checkPatient}= require('../../middleware/authMiddleware');

const router = express.Router();


router.get('/appointmentSpecial/:id',requireAuth,checkLogin,checkPatient,patientController.appointmentSpecial_get);
router.get('/appointmentcalendar/:id',requireAuth,checkLogin,checkPatient,patientController.appointmentcalendar_get);
router.get('/appointmentform/:id',requireAuth,checkLogin,checkPatient,patientController.appointmentform_get);
router.post('/appointmentform',requireAuth,checkLogin,checkPatient,patientController.appointmentform_post);
router.get('/appointmentinfo',requireAuth,checkLogin,checkPatient,patientController.appointmentinfo_get);
router.delete('/appointmentinfo/:id',requireAuth,checkLogin,checkPatient,patientController.appointmentinfo_delete);
router.get('/appointmentdetail/:id',requireAuth,checkLogin,checkPatient,patientController.appointmentdetail_get);
router.get('/appointmentmedicalform/:id',requireAuth,checkLogin,checkPatient,patientController.appointmentmedicalform_get);
router.get('/appointmentUpdateInfo',requireAuth,checkLogin,checkPatient,patientController.appointmentUpdateInfo_get);
router.put('/appointmentUpdateInfo',requireAuth,checkLogin,checkPatient,patientController.appointmentUpdateInfo_put);


module.exports=router;
