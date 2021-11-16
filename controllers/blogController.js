const Blog = require('../models/User');

const blog_homepage=(req,res)=>{
    res.render('homepage')
}

const login_get=(req,res)=>{
    res.render('login')
}
module.exports = {
    blog_homepage,
    login_get 
    
  }