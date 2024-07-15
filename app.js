require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const postRoutes = require('./routes/posts')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');
const flash = require('connect-flash');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Inspire', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.log(err));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files from the 'public' directory (optional)
app.use(express.static('public'));

// Middleware for parsing POST request bodies
app.use(express.urlencoded({ extended: true }));

//Middleware for sessions
app.use(session({
    secret: process.env.SESSION_SECRET,//use an environment variable here in production
    resave: false,
    saveUninitialized: false
}));

//Flash middleware
app.use(flash());

//Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());


// Passport local strategy for username/password authentication
// passport.use(User.createStrategy());  
passport.use(new LocalStrategy(User.authenticate()));

//serialize user into session
passport.serializeUser(User.serializeUser());

//deserialize user from session
passport.deserializeUser(User.deserializeUser());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/boilerplate'); // Specify the default layout file

// Static files middleware (for serving CSS, JS, images, etc.)
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to pass flash messages to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.error_msg = req.flash('error_msg'); // added
  res.locals.error = req.flash('error'); //added
  next();
});

// //Routes
// app.use(postRoutes);

//Define routes with Router
const userRouter = require('./routes/user');
app.use('/', userRouter);

const blogRouter = require('./routes/blog');
app.use('/', blogRouter);

const postRouter = require('./routes/posts');
app.use('/posts', postRouter);

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});


 // Handle POST request for login using Passport authentication
// app.post('/users/login', passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login',
//     failureFlash: true
// }));

//the above was changed and add below
app.post('/users/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log("Authentication error: ", err);
      return next(err);
    }
    if (!user) {
      req.flash('error_msg', 'Invalid username or password');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log("Login error: ", err);
        return next(err);
      }
      console.log("Authenticated and logged in user: ", user);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});
/// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

//protected route
app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});
// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          console.log(err);
          return next(err);
      }
      req.flash('success_msg', 'You have logged out');
      res.redirect('/');
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
