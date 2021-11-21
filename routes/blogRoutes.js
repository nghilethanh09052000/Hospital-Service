const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

//router.get('/',blogController.blog_homepage);
//router.get('/appointment',blogController.blog_appointment);

router.get('/login', blogController.login_get);
router.post('/login', blogController.login_post);

router.get('/register', blogController.register_get);
router.post('/register', blogController.register_post);

router.get('/sendMail', blogController.sendMail_get);
router.post('/sendMail',blogController.sendMail_post);

router.get('/changePass',blogController.changePass_get);
router.post('/changePass',blogController.changePass_post);

router.get('/logout', blogController.logout_get);


module.exports=router;