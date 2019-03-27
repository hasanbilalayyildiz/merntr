const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//user model
const User = require ('../models/User');

//login SAyfası
router.get('/login',(req,res)=>res.render('login'));
//Kayit sayfası
router.get('/register',(req,res)=>res.render('register'));

//register handle

router.post('/register',(req,res)=>{
    const {name,email,password,password2} = req. body;
    let errors = [];

    //Check Required Fields
    if(!name || !email || !password ||!password2){

        errors.push({msg: 'Lütfen boş bıraktığınız yerleri doldurunuz.'});
    }
//şifreyi doğrulama 
if(password !== password2){
    errors.push({msg: 'Şifreler uyuşmuyor.'});
}
//şifre uzunluğu
if(password.length<6){
    errors.push({msg: 'Şifreniz en az 6 karakter olmalı.'});
}
if(errors.length>0){
   res.render('register',{ 
       errors,
       name,
       email,
       password,
       password2
   });
}
else{
  //validation sağlandı
  User.findOne({email: email})
  .then(user => {
      if (user) {
          // Kullanıcı kayıtlıysa
          errors.push({msg: 'Email zaten kullanılmakta.'});
        res.render('register',{ 
            errors,
            name,
            email,
            password,
            password2
      });
     }else {
        const newUser = new User({
            name,
            email,
            password
        });
        //hash password
        bcrypt.genSalt(10,(err,salt)=>
         bcrypt.hash(newUser.password,salt,(err,hash) =>{
            if(err) throw err;
        //Set passwprd to hashed 
            newUser.password= hash;
            //save user
            newUser.save()
            .then(user=>{   
                req.flash('success_msg','Kaydoldunuz.Giriş yapabilirsiniz');
                res.redirect('/users/login');
             })
            .catch(err=>console.log(err));
        }) )
        
     }
    });
  
  }
});
//login handle
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect : '/dashboard',
    failureRedirect: '/users/login',
    failureFlash : true
})(req,res,next);
});
//Çıkış
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Çıkış yaptınız.');
    res.redirect('/users/login');
});
module.exports =router;