const passport = require('passport');
const UsersModel = require('../models/users-model.js');
const bcrypt = require('bcrypt');


module.exports = {
    postLogin: async (req, res, next) => {
        try{
            let loginUsername = req.body.username;
            let loginPassword = req.body.password;
            let invalidCredsMsg = ["Incorrect credentials entered.", "Please try again or <a href='/register'>create a new account</a>."]
            
            if(loginUsername != undefined && loginUsername != "" && loginPassword != undefined && loginPassword != ""){
                // Utilizes the passport local strategy configured in ../config/passport-config.js to authenticate the user to allow for additional authentication stratgies to be used in future.
                passport.authenticate('local', (err, loginUsername, info) => {
                    if(err) {
                        req.flash('error', invalidCredsMsg);
                        return next(err.toString())}
                    if(!loginUsername) {
                        req.flash('error', invalidCredsMsg);
                        return res.redirect('/login');
                    }
                    req.logIn(loginUsername, (err) => {
                        if (err) {
                            console.log('login err') 
                            return next(err.toString())
                        }
                        console.log(`'${loginUsername.username}' successfully logged in.`);
                        res.redirect('/feed');
                    });
                })(req, res, next);
            }else{
                req.flash('error', invalidCredsMsg);
                res.redirect('/login');
            }
            
        }catch(err){
            console.error(err.toString());
        }
       
    },

    postRegister: async (req, res) => {
        try{
            let newUsername = req.body.username;
            let newPassword = req.body.password;
            let invalidCredsMsg = ["Please make sure both Username and Password fields are filled out."]
            
            if (newUsername == "" || newPassword == ""){
                req.flash('error', invalidCredsMsg)
                console.log("Please make sure to fill out both username and password fields.")
                res.redirect('/register');
            // Ensures minimum password is set to at least 8 characters as recommended by OWASP authentication cheatsheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
            } else if (newPassword.length < 8){
                req.flash('error', "Your password must be at least 8 characters in length");
                res.redirect('/register');
            
            // Makes sure passwords submitted during registration are less likely to exceed the 72 byte limit allocated for the password string that bcrypt hashes.
            } else if (newPassword.length > 50){
                req.flash('error', "Your password exceeds the maximum password length of 50 characters");
                res.redirect('/register');
            }else{
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                let result = await UsersModel.addNewUser(hashedPassword, newUsername);
                
                if (result === true){
                    console.log(`Created new user account: ${newUsername}.`);
                    res.redirect('/login');
                } else if ( result === false){
                    req.flash('error', ['Username has already been taken.']);
                    console.log("Username already exists");
                    res.redirect('/register');
                } else{
                    console.error(result);
                }
            }
        }catch (err){
            console.error(err);
            res.redirect('/register');
        }
    },

    postLogout: async (req, res) => {
        let username = req.user.username;
        try{
            req.logout(() => {
                console.log(`Logged out ${username}.`);
                res.redirect('/');
            });
        }catch (err){
            console.error(err);
        }
        
    }
}