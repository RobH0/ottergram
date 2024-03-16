const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("feed_no_auth.ejs");
})