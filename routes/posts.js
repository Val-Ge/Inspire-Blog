const express = require('express');
const postController = require('../controllers/post');

const router = express.Router();

//route to list all post
router.get('/posts', async (req, res) => {
  try {
    const posts = await this.post.find() // pass false to prevent sending json response
    res.render('index', { posts }); //render index.ejs and pass the posts to it 
  } catch (error) {
    res.status(500).send(error);
  }
});

// router.get('/posts/:id', postController.getPostById);

//route to view a single post
router.get('/show/:id', async (req, res) => {
  try {
    const post = await this.post.findById(req, res);
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
    const post = await post.findById;
if(!post) {
  return res.status(404).send('Post not found');
}  
res.render('edit', { post }); //render edit.ejs and pass the post to it
  } catch (error) {
    res.status(500).send(error);
  }
});

//route to handle creating a new post
router.post('/posts', async (req, res) => {
  try {
    const post = new post({
      title: req.body.title,
      content: req.body.content
    });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

//route to handle updating a post
router.patch('/posts/:id', async (req, res) => {
  try {
    const post = await post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

//rooute to handle deleting a post
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});


// router.get('/posts', (req, res) => {
//     res.render('posts/post', { title: 'Blog Posts' });
//   });

module.exports = router;