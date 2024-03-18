
const express = require('express');
const router = express.Router();
const NoAuthController = require('../controllers/no-auth-controller.js');

router.get('/', NoAuthController.getFeed);
router.get('/login', NoAuthController.getLogin);
router.get('/register', NoAuthController.getRegister);

module.exports = router;