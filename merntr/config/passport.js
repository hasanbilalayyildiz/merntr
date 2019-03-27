const LocalStrategy = require ('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Laod user model
const User = require('../models/User');

module.exports = function(passport){

    passport.use(
        new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
            //kullancıı eşleşme
            User.findOne({email:email})
            .then (user =>{
                if(!user){
                    return done(null,false,{message: 'Bu email kaydedilmemiş.'});
                }
                //şifre eşleşme
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                   if(err) throw err;
                   if(isMatch) {
                       return done(null,user);
                   }else{
                    return done(null,false,{message:'Şifreniz doğru değil.'});
                   }    
                });
            })
            .catch(err=>console.log(err))
        })
    );

    passport.serializeUser((user, done) =>{
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user)=> {
          done(err, user);
        });
      });
}