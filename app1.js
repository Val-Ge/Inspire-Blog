require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user');
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

// Middleware for sessions
app.use(session({
    secret: process.env.SESSION_SECRET, // Use an environment variable here in production
    resave: false,
    saveUninitialized: false
}));

// Flash middleware
app.use(flash());

// Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for username/password authentication
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

// Serialize user into session
passport.serializeUser(User.serializeUser());

// Deserialize user from session
passport.deserializeUser(User.deserializeUser());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to pass flash messages to all views
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Define routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('blog/about', { title: 'About Us' });
});

app.get('/posts', (req, res) => {
    res.render('posts/posts', { title: 'Blog Posts' });
});

app.get('/contact', (req, res) => {
    res.render('blog/contact', { title: 'Contact Us' });
});

app.get('/login', (req, res) => {
    res.render('users/login', { title: 'Login', message: req.flash('error') });
});

app.get('/register', (req, res) => {
    res.render('users/register', { title: 'Register' });
});

app.post('/users/register', (req, res) => {
    const { email, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;
        const newUser = new User({ email, password: hashedPassword });
        newUser.save()
            .then(user => {
                res.redirect('/login');
            })
            .catch(err => console.log(err));
    });
});

// Handle POST request for login using Passport authentication
app.post('/users/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Protected route
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
