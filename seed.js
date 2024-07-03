const mongoose = require('mongoose');
const User = require('./models/user'); // Replace with the correct path to your User model

const users = [
    { username: "user1", email: "user1@example.com", password: "password1" },
    { username: "user2", email: "user2@example.com", password: "password2" }
];

mongoose.connect('mongodb://localhost:27017/Inspire', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Database connected');
        
        await User.deleteMany({});
        console.log('Old users removed');

        for (let i = 0; i < users.length; i++) {
            await User.register(new User({ email: users[i].email }), users[i].password);
            console.log(`User ${users[i].username} added`);
        }

        mongoose.connection.close();
        console.log('Database connection closed');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
