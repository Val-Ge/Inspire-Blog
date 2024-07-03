const express = require('express');
const router = express.Router();
const User = require('../models/user');

//render password reset request form
router.get('/forgot', (req, res) => {
    res.render('users/forgot', {title: 'Forgot password'});
});

//render password reset form
router.get('/reset/:token', (req, res) => {
    res.render('users/reset', {title: 'Reset password', token: req.params.token });
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// // const passport = require('passport');
// // const catchAsync = require('../utils/catchAsync');
// // const User = require('../models/user');
// // const users = require('../controllers/users');

// router.route('/register')
//     .get(users.renderRegister)
//     .post(catchAsync(users.register));

// router.route('/login')
//     .get(users.renderLogin)
//     .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// router.get('/logout', users.logout)

