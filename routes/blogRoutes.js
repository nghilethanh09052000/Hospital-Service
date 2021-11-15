const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/',blogController.blog_homepage);

module.exports=router;