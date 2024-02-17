const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, getCustomQuestions, editQuestion, deleteQuestion } = require('../controllers/fitg');
const verifyToken = require('../middleware/authentication')
// router.post('/register', register)
router.post('/createfitg', verifyToken, createQuestion);
router.get('/getfitg', getQuestions);
router.get('/getcustomfitg', getCustomQuestions);
router.patch('/editmfitg', verifyToken, editQuestion)
router.delete('/deletefitg', verifyToken, deleteQuestion)

module.exports = router