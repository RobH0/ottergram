const passport = require('passport');
require('./config/passport-config')(passport);

class NodeMain{
    constructor(){
        this.express = require('express');
        this.app = this.express();
        require('dotenv').config();
        this.session = require('express-session');
        this.noAuthRoutes = require('./routes/no_auth_routes.js');
        //this.catalogRoutes = require('./routes/catalogRoutes');
        this.mongo  = require('./config/database-config');
        this.MongoStore = require('connect-mongo');
        this.flash = require('express-flash');

        this.port = process.env.PORT;
        
    }

    async start(){
        console.log("Starting server...")
        
        await this.mongo.init();

        this.app.set('view engine', 'ejs');
        this.app.use(this.express.static('public'));

        this.app.use(this.express.json());
        this.app.use(this.express.urlencoded({ extended: false }));
        
        const sessionStore = this.MongoStore.create({ mongoUrl: process.env.MONGODB_AUTH_URI,
        dbName: process.env.DB_NAME});
        this.app.use(this.session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: sessionStore,
            // Sets cookie max age to 1 day
            cookie: {
                maxAge: 1000 * 60 * 60 * 24
            }
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.app.use(this.flash());

        this.app.use('/', this.noAuthRoutes);

        this.app.listen(this.port, (() => console.log(`Server listening on port ${this.port}`)));
    }
}

const main = new NodeMain;
main.start();