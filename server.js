const express = require('express');
const morgan =  require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser , checkLogin, checkPatient,checkDoctor,checkAdmin}= require('./middleware/authMiddleware');
const Specialization = require('./models/specialization');
const Appointment = require('./models/appointment');
const Clinic = require('./models/clinic');
const User = require('./models/User');

//express app
const app=express();

//middleware & static files:
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//register view engine
app.set('view engine','ejs');

var port = process.env.PORT || 3000;

//connect to mongodb & listen for requests
const dbURI='mongodb+srv://nghi:test1234@cluster0.mvd1w.mongodb.net/nghi?retryWrites=true&w=majority';
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(port))
    .catch((err) =>(console.log(err)));

//routes:
app.get('*', checkUser);

app.get('/',(req,res)=>{
    res.render('homepage',{title:'Trang chủ'});
})

app.get('/appointment',checkLogin,checkPatient, async (req,res)=>{
    const specializations = await Specialization.find()
    return res.render('appointment',{
      specializations:specializations,
       title:'Đặt lịch'});
    
})


app.get('/adminpage',checkLogin,checkAdmin, async (req,res)=>{
  const specializations = await Specialization.find()
  const clinics = await Clinic.find();
  const users = await User.find();
  return res.render('adminpage',{
    specializations:specializations,
    clinics:clinics,
    users:users,
    title:'Trang quản lý'})

})

app.get('/doctorpage',checkLogin,checkDoctor,(req,res)=>{
  
    res.render('doctorpage',{title:'Trang bác sĩ'})
  
  })



// blog routes
app.use(blogRoutes);


// 404 page
app.use((req, res) => {
    res.status(404).render('404');
  });