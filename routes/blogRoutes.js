const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/',blogController.blog_homepage);
router.get('/login', blogController.login_get);
module.exports=router;