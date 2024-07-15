// const mongoose = require('mongoose');
// const User = require('./models/user'); // Replace with the correct path to your User model

// const users = [
//     { username: "user1", email: "user1@example.com", password: "password1" },
//     { username: "user2", email: "user2@example.com", password: "password2" }
// ];

// mongoose.connect('mongodb://localhost:27017/Inspire', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(async () => {
//         console.log('Database connected');
        
//         await User.deleteMany({});
//         console.log('Old users removed');

//         for (let i = 0; i < users.length; i++) {
//             await User.register(new User({ email: users[i].email }), users[i].password);
//             console.log(`User ${users[i].username} added`);
//         }

//         mongoose.connection.close();
//         console.log('Database connection closed');
//     })
//     .catch(err => {
//         console.error('Database connection error:', err);
//     });

const mongoose = require('mongoose');
const User = require('./models/user'); // Replace with the correct path to your User model
const Post = require('./models/post'); // Replace with the correct path to your Post model

const users = [
    { username: "user1", email: "user1@example.com", password: "password1" },
    { username: "user2", email: "user2@example.com", password: "password2" }
];

const posts = [
    { title: 'Post 1', content: 'Content of post 1' },
    { title: 'Post 2', content: 'Content of post 2' },
    { title: 'Post 3', content: 'Content of post 3' }
];

mongoose.connect('mongodb://localhost:27017/Inspire', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Database connected');
        
        // Remove all existing users
        await User.deleteMany({});
        console.log('Old users removed');

        // Insert new users
        for (let i = 0; i < users.length; i++) {
            await User.register(new User({ username: users[i].username, email: users[i].email }), users[i].password);
            console.log(`User ${users[i].username} added`);
        }

        // Remove all existing posts (optional, depending on your needs)
        await Post.deleteMany({});
        console.log('Old posts removed');

        // Insert new posts
        await Post.insertMany(posts);
        console.log('Posts seeded successfully');

        mongoose.connection.close();
        console.log('Database connection closed');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
