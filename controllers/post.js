const Post = require('../models/post');

// Display all posts
module.exports.index = async (req, res) => {
    const posts = await Post.find({}).populate('popupText');
    res.render('posts/index', { posts });
};

// Render form to create a new post
module.exports.renderNewForm = (req, res) => {
    res.render('posts/new');
};

// Create a new post
module.exports.createPost = async (req, res, next) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    await post.save();
    console.log(post);
    req.flash('success', 'Successfully made a new post!');
    res.redirect(`/posts/${post._id}`);
};

// Show a specific post
module.exports.showPost = async (req, res) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'author'
    });
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('posts/show', { post });
};

// Render edit form for a specific post
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    res.render('posts/edit', { post });
};

// Update a specific post
module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post }, { new: true });
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts');
    }
    req.flash('success', 'Successfully updated post!');
    res.redirect(`/posts/${post._id}`);
};

// Delete a specific post
module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post');
    res.redirect('/posts');
};
