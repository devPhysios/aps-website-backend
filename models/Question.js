const mongoose = require('mongoose');

// Define the schema for MCQ questions
const mcqQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: String,
        required: true
    },
    correctOption: {
        type: Number,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default:[]
    }
});

// Define the schema for fill in the gap questions
const fillInTheGapQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

// Define the schema for essay questions
const essayQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    }
});

// Create the mongoose model for MCQ questions
const MCQQuestion = mongoose.model('MCQQuestion', mcqQuestionSchema);

// Create the mongoose model for fill in the gap questions
const FillInTheGapQuestion = mongoose.model('FillInTheGapQuestion', fillInTheGapQuestionSchema);

// Create the mongoose model for essay questions
const EssayQuestion = mongoose.model('EssayQuestion', essayQuestionSchema);

module.exports = {
    MCQQuestion,
    FillInTheGapQuestion,
    EssayQuestion
};
