module.exports = {
    ensureAuth: function (req, res, next){
        if (req.isAuthenticated()){            
            return next();
        } else {
            if (req.originalUrl == '/'){
                return next();
            }
            return res.redirect('/login');
        }
    }
}