module.exports = {
    ensureAuth: function (req, res, next){
        if (req.isAuthenticated()){   
            if (req.originalUrl == '/' || req.originalUrl == '/login' || req.originalUrl == '/register'){
                return res.redirect('/feed');
            }         
            return next();
        } else {
            if (req.originalUrl == '/' || req.originalUrl == '/login' || req.originalUrl == '/register'){
                return next();
            }
            return res.redirect('/login');
        }
    }
}