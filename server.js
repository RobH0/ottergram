

class NodeMain{
    constructor(){
        this.express = require('express');
        this.app = this.express();
        require('dotenv').config();
        //this.session = require('express-session');
        this.noAuthRoutes = require('./routes/no_auth_routes.js');
        //this.catalogRoutes = require('./routes/catalogRoutes');
        this.mongo  = require('./config/database-config');
        //this.MongoStore = require('connect-mongo');
        //this.flash = require('express-flash');

        this.port = process.env.PORT;
        
    }

    async start(){
        console.log("Starting server...")
        
        await this.mongo.init();

        this.app.set('view engine', 'ejs');
        this.app.use(this.express.static('public'));

        this.app.use(this.express.json());
        this.app.use(this.express.urlencoded({ extended: false }));

        //this.app.use('/', this.noAuthRoutes);

        this.app.get('/', (req, res) =>{
            res.render("feed_no_auth.ejs")
        });

        this.app.listen(this.port, (() => console.log(`Server listening on port ${this.port}`)));
    }
}

const main = new NodeMain;
main.start();