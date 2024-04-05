const express = require('express');
const router = express.Router();

const { getQuestionsByCreator } = require('../controllers/questions');
const { getQuestionsByCourseCode } = require('../controllers/questions');

router.get('/creators', getQuestionsByCreator);
router.get('/:courseCode', getQuestionsByCourseCode);

module.exports = router;