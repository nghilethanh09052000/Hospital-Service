const express = require('express');
const morgan =  require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

// express app
const app=express();

//connect to mongodb & listen for requests
const dbURI='mongodb+srv://nghi:test1234@cluster0.mvd1w.mongodb.net/nghi?retryWrites=true&w=majority';
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) =>(console.log(err)));



//app.listen(3000)

//register view engine
app.set('view engine','ejs');

//middleware & static files:
app.use(express.static('public'));

//routes:
app.get('/',(req,res)=>{
    res.render('homepage');
})

// blog routes
app.use(blogRoutes);