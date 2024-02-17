const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, getCustomQuestions, editQuestion, deleteQuestion } = require('../controllers/essayqs');
const verifyToken = require('../middleware/authentication')
// router.post('/register', register)
router.post('/createessayqs', verifyToken, createQuestion);
router.get('/getessayqs', getQuestions);
router.get('/getessayqs', getCustomQuestions);
router.patch('/editessayqs', verifyToken, editQuestion)
router.delete('/deleteessayqs', verifyToken, deleteQuestion)

module.exports = router