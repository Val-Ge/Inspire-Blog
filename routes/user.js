const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');  // Add this line to require bcryptjs
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register', { title: 'Register' });
  });

//render password reset request form
router.get('/forgot', (req, res) => {
    res.render('users/forgot', {title: 'Forgot password'});
});

//render password reset form
router.get('/reset/:token', (req, res) => {
    res.render('users/reset', {title: 'Reset password', token: req.params.token });
});

router.get('/login', (req, res) => {
    res.render('users/login', { title: 'Login', message: req.flash('error') });
  });

router.post('/users/register', (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;
        const newUser = new User({ username, email, password: hashedPassword });
        newUser.save()
        .then(user => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));
    });
});


module.exports = router;



