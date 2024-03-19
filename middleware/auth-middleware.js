module.exports = {
    ensureAuth: function (req, res, next){
        if (req.isAuthenticated()){            
            if(req.originalUrl == '/'){
                return res.redirect('/feed');
            }
            return next();
        } else {
            if (req.originalUrl == '/'){
                return next();
            }
            return res.redirect('/login');
        }
    }
}