const express = require('express');
const morgan =  require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser}= require('./middleware/authMiddleware');

// express app
const app=express();

//middleware & static files:
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//register view engine
app.set('view engine','ejs');


//connect to mongodb & listen for requests
const dbURI='mongodb+srv://nghi:test1234@cluster0.mvd1w.mongodb.net/nghi?retryWrites=true&w=majority';
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) =>(console.log(err)));

//routes:
app.get('*', checkUser);
app.get('/',(req,res)=>{
    res.render('homepage',{title:'Trang chủ'});
})
app.get('/appointment',requireAuth,(req,res)=>{
    res.render('appointment',{title:'Đặt lịch'});
})

// blog routes
app.use(blogRoutes);


// 404 page
app.use((req, res) => {
    res.status(404).render('404');
  });