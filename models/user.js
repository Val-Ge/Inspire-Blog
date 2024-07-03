const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//define userSchema no need to specify username or password as we are using the plugin password

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // it sets up an index
    }
});
UserSchema.plugin(passportLocalMongoose); //this will add a user and password onto our schema

module.exports = mongoose.model('User', UserSchema);

