const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Appointment = require('../models/appointment');

const requireAuth = (req,res,next)=>{
    //grab the token 
    const token = req.cookies.jwt;
    //check if it exists & is verified
    if(token){
        jwt.verify(token,'nghi',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
};
//check current user:
const checkUser= (req,res,next)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,'nghi', async (err,decodedToken)=>{
            if(err){
               res.locals.user =null;
                next();
            }else{
                let user = await User.findById(decodedToken.id);
                res.locals.user=user;
                
                next();
            }
        })
    }else{
        res.locals.user= null;
        next();
    }
}

// Check admin permission
const checkLogin= (req,res,next)=>{
   try{
    const token = req.cookies.jwt;
    const idUser = jwt.verify(token,'nghi')
    User.findById(idUser.id)
    .then(data =>{
        if(data){
            req.data=data
            next()
        }else{
            res.json('Not Permission1')
        }
    }).catch(err=>{
        res.render('404', { title: 'Trang không tìm thấy' });
    })

    }catch(err){
        res.redirect('/login');
    }
}
const checkPatient = (req,res,next)=>{
    var role = req.data.role;
    if(role =='patient'){
        next();
    }else{
        console.log(req.data.email)
        console.log(role)
        res.render('404', { title: 'Trang không tìm thấy' });
    }
}

const checkDoctor = (req,res,next)=>{
    var role = req.data.role;
    if(role ==='doctor'){
        next();
    }else{
        console.log(role)
        res.render('404', { title: 'Trang không tìm thấy' });
    }
}

const checkAdmin = (req,res,next)=>{
    var role = req.data.role;
    if(role ==='admin'){
        next();
    }else{
        console.log(role)
        res.render('404', { title: 'Trang không tìm thấy' });
    }
}


module.exports={requireAuth ,checkUser,checkLogin, checkPatient,checkDoctor,checkAdmin};