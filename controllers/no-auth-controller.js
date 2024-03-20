const PostsModel = require('../models/posts-model.js')
const UsersModel = require('../models/users-model.js')


class NoAuthController{
    constructor() {
        // binding this to getFeed method to prevent this being undefined when the calcTimeDiff method is called within the getFeed method.
        this.getFeed = this.getFeed.bind(this);
    }
    
    calcTimeDiff(datePosted, currentDate){
        let timeDifferenceMs = currentDate - datePosted 
                
        let seconds = Math.floor(timeDifferenceMs/1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);
        let weeks = Math.floor(days / 7);
        let months = Math.floor(days / 30);
        let years = Math.floor(days / 365)

        if (years >= 1){
            return 'Posted ' + years + ' years ago';
        } else if (months>= 1 ){
            return 'Posted ' + months + ' months ago';
        } else if (weeks >= 1){
            return 'Posted ' + weeks + ' weeks ago';
        } else if (days >= 1){
            return 'Posted ' + days + ' days ago';
        } else if (minutes >= 1){
            return 'Posted ' + minutes + ' minutes ago';
        }else if (seconds >= 1){
            return 'Posted ' + seconds + ' seconds ago';
        }                
    }
    
    async getFeed(req, res){
        try{
            let posts = await PostsModel.getAllPosts();
            let currentDate = new Date();

            for (let index = 0; index < posts.length; index++){
                
                if (posts[index].datePosted != null){
                    let dateString = this.calcTimeDiff(posts[index].datePosted, currentDate);
                    posts[index].datePosted = dateString;
                }
                
                let userInfo = await UsersModel.getUsernameAndPic(posts[index].createdBy);
                posts[index].postByUsername = userInfo.username;
                posts[index].profilePic = userInfo.profilePic;
            }
            res.render("feed_no_auth.ejs", { allPosts : posts});
        }catch (err){
            console.error(err);
        }
    }
    
    getLogin(req, res){
        try{
            res.render("login.ejs");
        }catch (err){
            console.error(err);
        }
    }

    getRegister(req, res){
        try{
            res.render("register.ejs");
        }catch (err){
            console.error(err);
        }
    }
}

module.exports = new NoAuthController;