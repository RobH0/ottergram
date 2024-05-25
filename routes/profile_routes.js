const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile-controller.js')
const authController = require('../controllers/auth-controller.js')
const { ensureAuth } = require("../middleware/auth-middleware.js");
const multer = require("../middleware/multer-middleware.js")

router.get('/profile', ensureAuth, profileController.getYourProfile);
router.delete('/profile/delete-posts', ensureAuth, profileController.deletePosts);
router.get('/profile/followers', ensureAuth, profileController.getFollowers);
router.get('/profile/following', ensureAuth, profileController.getFollowing);

router.post('/logout', ensureAuth, authController.postLogout);

router.get('/new-post', ensureAuth, profileController.getCreatePost);
router.post('/new-post', ensureAuth, multer.single('file'), profileController.createNewPost);

router.get('/feed', ensureAuth, profileController.getPersonalizedFeed);
router.get('/feed/:filter', ensureAuth, profileController.getPersonalizedFeed);

router.get('/settings', ensureAuth, profileController.getSettings);
router.post('/settings', ensureAuth, multer.single('changeProfilePic'),profileController.postSettings);

router.get('/user/:userId', ensureAuth, profileController.getUserProfile);
router.patch('/user/follow', ensureAuth, profileController.followUser);
router.patch('/user/unfollow', ensureAuth, profileController.unFollowerUser);
router.get('/user/:userId/followers', ensureAuth, profileController.getFollowers);
router.get('/user/:userId/following', ensureAuth, profileController.getFollowing)


router.patch('/post/:postId/unlike', ensureAuth, profileController.unlikePost);
router.patch('/post/:postId/like', ensureAuth, profileController.likePost);
router.get('/post/:postId', ensureAuth, profileController.getPostPage);
router.post('/post/:postId/post-comment', ensureAuth, profileController.postComment);
router.delete('/post/:postId/delete-comment', ensureAuth, profileController.deleteComment);

module.exports = router;