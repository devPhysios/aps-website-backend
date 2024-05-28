const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const { MCQQuestion, EssayQuestion, FillInTheGapQuestion } = require("../models/Question");

const getUploadedQuestions = async (req, res) => {
  try {
    const { level } = req.params;
    if (!level) return res.status(StatusCodes.BAD_REQUEST).json({ error: "Level is required" });
    
    const mcqQuestions = await MCQQuestion.find({ level });
    const essayQuestions = await EssayQuestion.find({ level });
    const fillInTheGapQuestions = await FillInTheGapQuestion.find({ level });
    const courseCodes = new Set();
    mcqQuestions.forEach(question => courseCodes.add(question.courseCode));
    essayQuestions.forEach(question => courseCodes.add(question.courseCode));
    fillInTheGapQuestions.forEach(question => courseCodes.add(question.courseCode));
    const uniqueCourseCodes = Array.from(courseCodes);
    res.status(StatusCodes.OK).json({ courseCodes: uniqueCourseCodes });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = { getUploadedQuestions };
