const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile-controller.js')
const authController = require('../controllers/auth-controller.js')
const { ensureAuth } = require("../middleware/auth-middleware.js");

router.get('/profile', ensureAuth, profileController.getYourProfile);
router.post('/logout', ensureAuth, authController.postLogout);
router.get('/post', ensureAuth, profileController.getCreatePost);

module.exports = router;