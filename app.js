const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const user = require('./models/user')

const path = require('path');

const app = express();
const port = 3000;

// Middleware for parsing POST request bodies
app.use(express.urlencoded({ extended: true }));

//Middleware for sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

//Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());


// Passport local strategy for username/password authentication
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Incorrect email.' }); }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) { return done(err); }
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }));
  
//serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//deserialize user from session
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

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

  app.get('/register', (req, res) => {
    res.render('users/register', { title: 'Register' });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
