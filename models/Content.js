const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'text', 'quiz'],
        required: true
    },
    contentText: {
        type: String,
        required: true
    },
    videoURL: {
        type: String // for 'video' type content
    },
    quizQuestions: [{
        question: String,
        options: [String],
        correctAnswer: String
    }],
    xpReward: {
        type: Number,
        default: 10 // How much XP user gets after completion
    },
    timeRequired: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Content', contentSchema);
