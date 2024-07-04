const express = require('express');
const postController = require('../controllers/post');

const router = express.Router();

//route to list all post
router.get('/posts', async (req, res) => {
  try {
    const posts = await postController.getAllPosts(req, res, false); // pass false to prevent sending json response
    res.render('index', { posts }); //render index.ejs and pass the posts to it 
  } catch (error) {
    res.status(500).send(error);
  }
});

// router.get('/posts/:id', postController.getPostById);

//route to view a single post
router.get('/show/:id', async (req, res) => {
  try {
    const post = await postController.getPostById(req, res);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('show', { post }); //render show.ejs and pass the post to it
  } catch (error) {
    res.status(500).send(error);
  }
});

//route to render form for creating a new post
router.get('/new', (req, res) => {
  res.render('createPost'); //render new.ejs
});

//route to render form for editing a post
router.get('/edit/:id', async (req, res) => {
  try {
    const post = await postController.getPostById(req, res);
if(!post) {
  return res.status(404).send('Post not found');
}  
res.render('edit', { post }); //render edit.ejs and pass the post to it
  } catch (error) {
    res.status(500).send(error);
  }
});

//route to handle creating a new post
router.post('/posts', postController.new);

//route to handle updating a post
router.patch('/posts/:id', postController.edit);

//rooute to handle deleting a post
router.delete('/posts/:id', postController.deletePost);


// router.get('/posts', (req, res) => {
//     res.render('posts/post', { title: 'Blog Posts' });
//   });

module.exports = router;