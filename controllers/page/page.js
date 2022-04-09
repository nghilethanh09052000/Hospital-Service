const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'Email không tồn tại';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'Sai mật khẩu';
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'Email này đã được đăng ký';
        return errors;
    }

    // validation errors
    if (err.message.includes('users validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//Create JWT:
const maxAge= 3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},'nghi',{
        expiresIn:maxAge
    });
};

const GioiThieuChung_get = (req,res)=>{
    res.render('./main/page/GioiThieuChung',{title:'Giới thiệu chung'});
}
const benhveda_get =(req,res)=>{
    res.render('./main/page/benhveda',{title:'Bệnh về da'});
}
const benhvaynen_get =(req,res)=>{
    res.render('./main/page/benhvaynen',{title:'thông tin'});
}

const benhcham_get =(req,res)=>{
    res.render('./main/page/benhcham',{title:'thông tin'});
}
const viemdacodia_get =(req,res)=>{
    res.render('./main/page/viemdacodia',{title:'thông tin'});
}
const benhchaminfor_get =(req,res)=>{
    res.render('./main/page/benhchaminfor',{title:'thông tin'});
}
const benhvayneninfor_get =(req,res)=>{
    res.render('./main/page/benhvayneninfor',{title:'thông tin'});
}
const viemdacodiainfor_get =(req,res)=>{
    res.render('./main/page/viemdacodiainfor',{title:'thông tin'});
}
const biquyetdakhoe_get =(req,res)=>{
    res.render('./main/page/biquyetdakhoe',{title:'thông tin'});
}
const biquyetdakhoeinfor_get =(req,res)=>{
    res.render('./main/page/biquyetdakhoeinfor',{title:'thông tin'});
}
const khambenhngoaida_get =(req,res)=>{
    res.render('./main/page/khambenhngoaida',{title:'Khám bệnh ngoài da'});
}
const  khamphukhoa_get=(req,res)=>{
    res.render('./main/page/khamphukhoa',{title:'Khám phụ khoa'});
}
const  khamnamkhoa_get =(req,res)=>{
    res.render('./main/page/khamnamkhoa',{title:'Khám nam khoa'});
}
const  khamvatuvantaohinhthammy_get =(req,res)=>{
    res.render('./main/page/khamthammy',{title:'Khám và tư vấn tạo hình thẩm mỹ'});
}
const khamthammyda_get =(req,res)=>{
    res.render('./main/page/khamthammyda',{title:'Khám thẩm mỹ da'});
}
const register_get=(req,res)=>{
    res.render('./main/page/register',{title:'Đăng ký'});
}
const register_post= async (req,res)=>{
    const { email,password}=req.body;
    try{
        const user= await User.create( {email, password} );
        const token =createToken(user._id);
        res.cookie('jwt',token, {httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user:user._id});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
const login_get=(req,res)=>{
    res.render('./main/page/login',{title:'Đăng nhập'})
}
const login_post= async (req,res)=>{
    const { email,password}=req.body;
    try{
        const user= await User.login(email, password);
        const token =createToken(user._id);
        res.cookie('jwt',token, {httpOnly:true,maxAge:maxAge*1000});
        const role = user.role;
        if(role=='patient'){
            const user = await User.findOne({email,role});
            res.status(200).json( {user:user._id} );
        }else if(role =='doctor'){
            const user1 = await User.findOne({email,role});
            res.status(200).json( {user1:user._id} );
        }else{
            const user2 = await User.findOne({email,role});
            res.status(200).json( {user2:user._id} );
        }
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
const logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}
const sendAdviceMail_get = (req,res)=>{
    res.render('./main/page/adviceMail',{title:'Nhận tư vấn'});
}
const sendAdviceMail_post = async (req,res)=>{
    const {email,fullname,phone,address,note}=req.body;

    try{
        res.status(201).json({email,fullname,phone,address,note});
        adviceMail(email,note);
        backadviceMail(email);
    }catch(err){
        res.status(400).send('Mail does not send');  
    }
}
const adviceMail = async ( email, note) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:'thanhnghi591@gmail.com',
            pass:'abcABC@123456'
        }
    });
    let mailOptions = await transporter.sendMail({
        from: email, // sender address
        to:  'thanhnghi591@gmail.com' , // list of receivers
        subject: "Hello, ", // Subject line
        text: note // plain text body
       // html: code, // html body
      });

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).send(setting.status("User created Successfully, Please Check your Mail"))
        }
      });
      
}

// Send back adviceMail: 
const backadviceMail = async (email) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:'thanhnghi591@gmail.com',
            pass:'abcABC@123456'
        }
    });
    let mailOptions = await transporter.sendMail({
        from: 'thanhnghi591@gmail.com', // sender address
        to:  email , // list of receivers
        subject: "Hello, ", // Subject line
        text: "We have receive your question"// plain text body
       // html: code, // html body
      });

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).send(setting.status("User created Successfully, Please Check your Mail"))
        }
      });
      
}

module.exports = {
    GioiThieuChung_get,
    benhveda_get,
    benhvaynen_get,
    benhcham_get,
    viemdacodia_get,
    benhvayneninfor_get,
    benhchaminfor_get,
    viemdacodiainfor_get,
    biquyetdakhoe_get,
    biquyetdakhoeinfor_get,
    khambenhngoaida_get,
    khamnamkhoa_get,
    khamphukhoa_get,
    khamvatuvantaohinhthammy_get,
    khamthammyda_get,
    login_get,
    login_post,
    register_get,
    register_post,
    logout_get,
    sendAdviceMail_get,
    sendAdviceMail_post,

}