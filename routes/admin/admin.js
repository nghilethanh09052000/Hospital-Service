const express = require('express');
const adminController = require('../../controllers/admin/admin');
const {requireAuth, checkLogin, checkAdmin}= require('../../middleware/authMiddleware');
const router = express.Router();

router.get('/adminPageChart',requireAuth,checkLogin, checkAdmin,adminController.adminPageChart_get);
router.get('/adminPageUserAccount',requireAuth,checkLogin, checkAdmin,adminController.adminPageUserAccount_get);
router.get('/adminPageUserAccountDetails/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageUserAccountDetails_get);
router.put('/adminPageUserAccountDetails',requireAuth,checkLogin, checkAdmin,adminController.adminPageUserAccountDetails_put);
router.delete('/adminPageUserAccount/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageUserAccount_delete);
router.get('/adminPageDoctorAccount',requireAuth,checkLogin, checkAdmin,adminController.adminPageDoctorAccount_get);
router.delete('/adminPageDoctorAccount/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageDoctorAccount_delete);
router.get('/adminPageAdminAccount',requireAuth,checkLogin, checkAdmin,adminController.adminPageAdminAccount_get);
router.put('/adminPageAdminAccount',requireAuth,checkLogin, checkAdmin,adminController.adminPageAdminAccount_put);
router.get('/adminPageDoctorAccountDetail/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageDoctorAccountDetail_get);
router.put('/adminPageDoctorAccountDetail',requireAuth,checkLogin, checkAdmin,adminController.adminPageDoctorAccountDetail_put);
router.get('/adminPageDoctorAccountDetails/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageDoctorAccountDetails_get);
router.put('/adminPageDoctorAccountDetails',requireAuth,checkLogin, checkAdmin,adminController.adminPageDoctorAccountDetails_put);
router.get('/adminPageCreateSpecialization',requireAuth,checkLogin, checkAdmin,adminController.adminPageCreateSpecialization_get);
router.post('/adminPageCreateSpecialization',requireAuth,checkLogin, checkAdmin,adminController.adminPageCreateSpecialization_post);
router.get('/adminPageSpecialization',requireAuth,checkLogin, checkAdmin,adminController.adminPageSpecialization_get);
router.delete('/adminPageSpecialization/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageSpecialization_delete);
router.get('/adminPageSpecializationDetails/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageSpecializationDetails_get);
router.put('/adminPageSpecialization',requireAuth,checkLogin, checkAdmin,adminController.adminPageSpecialization_put);
router.get('/adminPageCreateClinic',requireAuth,checkLogin, checkAdmin,adminController.adminPageCreateClinic_get);
router.post('/adminPageCreateClinic',requireAuth,checkLogin, checkAdmin,adminController.adminPageCreateClinic_post);
router.get('/adminPageClinic',requireAuth,checkLogin, checkAdmin,adminController.adminPageClinic_get);
router.delete('/adminPageClinic/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageClinic_delete);
router.get('/adminPageAppointment',requireAuth,checkLogin, checkAdmin,adminController.adminPageAppointment_get);
router.get('/adminPageAppointmentDetail/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageAppointmentDetail_get);
router.get('/adminPagePreDetail/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPagePreDetail_get);
router.get('/adminPageDoctorAccountInfo/:id',requireAuth,checkLogin, checkAdmin,adminController.adminPageDoctorAccountInfo_get);


module.exports=router;