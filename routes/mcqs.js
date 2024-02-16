const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, getCustomQuestions, editQuestion, deleteQuestion } = require('../controllers/mcqs');
const verifyToken = require('../middleware/authentication')
// router.post('/register', register)
router.post('/createmcqs', verifyToken, createQuestion);
router.get('/getmcqs', getQuestions);
router.get('/getcustommcqs', getCustomQuestions);
router.patch('/editmcqs', verifyToken, editQuestion)
router.delete('/deletemcqs', verifyToken, deleteQuestion)

module.exports = router