module.exports = {
    ensureAuthenticated : function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Bu sayfayı görüntüleyebilmek için giriş yapmalısınız.');
        res.redirect('/users/login');
    }
}