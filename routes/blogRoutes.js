const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/',blogController.blog_homepage);

router.get('/login', blogController.login_get);
//router.post('/login', blogController.login_post);

router.get('/register', blogController.register_get);
router.post('/register', blogController.register_post);

module.exports=router;