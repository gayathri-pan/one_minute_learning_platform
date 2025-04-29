// Tells MongoDB how user data should look (fields like username, password, xp)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },

    xp: {
        type: Number,
        default: 0
    },
    badges: {
        type: [String],
        default: []
    },
    level: {
        type: Number,
        default: 1
    },
    profilePicture: {
        type: String,
        default: 'default.png'
    },
    completedContents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }],
    ongoingContents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }],

    createdAt: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);