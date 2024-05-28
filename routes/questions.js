const express = require("express");
const router = express.Router();

const { getQuestionsByCreator } = require("../controllers/questions");
const { getQuestionsByCourseCode } = require("../controllers/questions");
const { getUploadedQuestions } = require("../controllers/uploadedquestions");

router.get("/creators", getQuestionsByCreator);
router.get("/:courseCode", getQuestionsByCourseCode);
router.get("/uploaded/:level", getUploadedQuestions);  

module.exports = router;
