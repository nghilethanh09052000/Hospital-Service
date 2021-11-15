const express = require('express');
const morgan =  require('morgan');
const mongoose = require('mongoose');

// express app
const app=express();

//connect to mongodb & listen for requests
const dbURI='mongodb+srv://nghi:test1234@notetuts.wifw2.mongodb.net/nghi';
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(3000))
    .catch(err =>(console.log(err)));

//register view engine
app.set('view engine','ejs');

//middleware & static files:
app.use(express.static('public'));

//routes:
app.get('/',(req,res)=>{
    res.redirect('/blogs')
})