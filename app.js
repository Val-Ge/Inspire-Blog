const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// const contactRoutes = require('./routes/contact');
// const aboutRoutes = require('./routes/about');
// const postRoutes = require('./routes/post');

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/boilerplate'); // Specify the default layout file

// Static files middleware (for serving CSS, JS, images, etc.)
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/about', aboutRoutes)
// app.use('/contact', contactRoutes)
// app.use('/posts', postRoutes)
// app.use('/user', userRoutes)

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
