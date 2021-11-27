const express = require('express');
const blogController = require('../controllers/blogController');
const {requireAuth, checkUser}= require('../middleware/authMiddleware');

const router = express.Router();

//router.get('/',blogController.blog_homepage);
//router.get('/appointment',blogController.blog_appointment);

router.get('/GioiThieuChung',blogController.GioiThieuChung_get);
router.get('/benhveda', blogController.benhveda_get);

router.get('/login', blogController.login_get);
router.post('/login', blogController.login_post);

router.get('/register', blogController.register_get);
router.post('/register', blogController.register_post);

router.get('/sendMail', blogController.sendOTP_get);
router.post('/sendMail',blogController.sendOTP_post);

router.get('/adviceMail', blogController.sendAdviceMail_get);
router.post('/adviceMail', blogController.sendAdviceMail_post);

router.get('/changePass',blogController.changePass_get);
router.post('/changePass',blogController.changePass_post);

router.get('/logout', blogController.logout_get);

router.post('/appointment',blogController.appointment_post);

router.get('/appointmentinfo',blogController.appointmentinfo_get);
router.delete('/appointmentinfo/:id',blogController.appointmentinfo_delete);

router.get('/appointmentdetail/:id',blogController.appointmentdetail_get);


router.get('/userAccount',blogController.userAccount_get);
module.exports=router;