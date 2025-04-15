const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/app`);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phone: String
});

module.exports = mongoose.model('User', userSchema);