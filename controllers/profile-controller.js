const usersModel = require('../models/users-model.js');
const postsModel = require('../models/posts-model.js');



module.exports = {
    getYourProfile: async (req,res) =>{
        console.log(JSON.stringify(req.user));
        let userPostInfo = await postsModel.getUserPosts(req.user._id);
        let currentUserInfo = await usersModel.getProfileInfo(req.user._id);
        console.log(userPostInfo[0]._id);
        console.log()
        res.render('profile.ejs', {userInfo: currentUserInfo, posts: userPostInfo});
    }
}