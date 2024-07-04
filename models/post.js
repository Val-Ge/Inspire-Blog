const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

postSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;