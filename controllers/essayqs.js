const { EssayQuestion } = require('../models/Question');
const StatusCodes = require('http-status-codes');
const { NotFoundError } = require('../errors')

const createQuestion = async (req, res) => {
    req.body.authorId = req.student.studentId
    const question = await EssayQuestion.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ question });
}

const getQuestions = async (req, res) => {
    const { level, coursetitle, tags, authorID } = req.query;
    const filter = {};
    if (level) {
        filter.level = level;
    }
    if (coursetitle) {
        filter.coursetitle = coursetitle;
    }
    if (tags) {
        filter.tags = tags;
    }
    if (authorID) {
        filter.authorID = authorID;
    }
    const questions = await EssayQuestion.find(filter);
    res.status(StatusCodes.OK).json({ questions });
};

const editQuestion = async (req, res) => {
    const { questionId } = req.params;
    const { authorId, ...updateData } = req.body;

    try {
        const question = await EssayQuestion.findOneAndUpdate(
            { _id: questionId, authorId: req.student.studentId },
            updateData,
            { new: true }
        );

        if (!question) {
            throw new NotFoundError('Question not found');
        }

        res.status(StatusCodes.OK).json({ question });
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }
};

const deleteQuestion = async (req, res) => {
    const { questionId } = req.params;
    try {
        const question = await EssayQuestion.findOneAndDelete({ _id: questionId, authorId: req.student.studentId });
        if (!question) {
            throw new NotFoundError('Question not found');
        }
        res.status(StatusCodes.OK).json({ message: 'Question deleted successfully' });
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }
};

module.exports = { createQuestion, getQuestions, editQuestion, deleteQuestion };