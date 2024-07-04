const express = require('express');
const router = express.Router();
// const User = require('../models/user');

router.get('/about', (req, res) => {
    res.render('blog/about', { title: 'About Us' });
  });


router.get('/contact', (req, res) => {
    res.render('blog/contact', { title: 'Contact Us' });
    });


module.exports = router;

