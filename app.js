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
mongoose.connect('mongodb://localhost:27017/your-database-name', {
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
passport.use(User.createStrategy());  
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
    res.render('users/login', { title: 'Login' });
  });

  // Handle POST request for login
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  // Add your login logic here
  res.send(`Email: ${email}, Password: ${password}`);
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

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
    
    res.redirect('/');
    });
});

// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// protected route
// app.get('/dashboard', ensureAuthenticated, (req, res) => {
//     res.render('dashboard', { user: req.user });
// });
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
