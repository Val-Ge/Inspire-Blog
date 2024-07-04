const Post = require('../models/post');

//create a new post
exports.new = async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send(error);
    }
};

//get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
};

//get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send();
        }
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
};

//update a post by ID
exports.edit = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(re.params.id, req.body, { new: true, runValidators: true});
        if (!post) {
            return res.status(404).send();
        }
        res.status(200).send(post);
    } catch (error) {
        res.status(400).send(error);
    }
};

//delete a post by ID
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).send();
        }
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
};