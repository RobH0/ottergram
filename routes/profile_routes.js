const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile-controller.js')
const authController = require('../controllers/auth-controller.js')

router.get('/profile', profileController.getYourProfile); 

module.exports = router;