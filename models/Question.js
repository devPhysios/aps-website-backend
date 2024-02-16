const mongoose = require('mongoose');

// Define the schema for MCQ questions
const mcqQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    imgURL: {
        type: String,
        default: null,
        required: false
    },
    options: {
        type: Array,
        required: true
    },
    answer: {
        type: Array,
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
    year: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default:[],
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedTimeHistory: {
        type: Array,
        default: null
    },
    updatedStudentHistory: {
        type: Array,
        default: null
    },
    lecturer: {
        type: String,
        required: false
    }
});

// Define the schema for fill in the gap questions
const fillInTheGapQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    imgURL: {
        type: String,
        default: null,
        required: false
    },
    answer: {
        type: Array,
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
    year: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default:[]
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedTimeHistory: {
        type: Array,
        default: null
    },
    updatedStudentHistory: {
        type: Array,
        default: null
    },
    lecturer: {
        type: String,
        required: false
    }
});

// Define the schema for essay questions
const essayQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    imgURL: {
        type: String,
        default: null,
        required: false
    },
    courseCode: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default:[]
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    answer: {
        type: String,
        required: false
    },
    updatedTimeHistory: {
        type: Array,
        default: null
    },
    updatedStudentHistory: {
        type: Array,
        default: null
    },
    lecturer: {
        type: String,
        required: false
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
