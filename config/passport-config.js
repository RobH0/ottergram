const UsersModel = require('../models/users-model');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};

async function authenticateUser(username, password, done){

    let user = await UsersModel.getUser(username);
    
    
    if (user === null  || user === "" || password === "" || password === null){
        return done(null, false, {msg: `User ${username} doesn't exist`});
    }
    let storedUserPasswordHash = user.password;
    let result = await bcrypt.compare(password, storedUserPasswordHash);
    if (result == true){
        console.log(`hash comparison was true for user: ${username}.`);
        return done(null, user)
    } else{
        console.log(`hash comparison was false for user: ${username}.`);
        return done(null, false, { msg: 'Invalid email or password.'});
    }
}

module.exports = function (passport) {
    const strategy = new LocalStrategy(customFields, authenticateUser);

    passport.use(strategy);

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (userId, done) => {
        UsersModel.getUserById(userId)
            .then((user) => {
                done(null, user);
            })
            .catch( err => done(err));
    });
}