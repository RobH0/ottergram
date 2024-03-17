
const express = require('express');
const router = express.Router();
const NoAuthController = require('../controllers/no-auth-controller.js');

router.get('/', NoAuthController.getFeed);

module.exports = router;