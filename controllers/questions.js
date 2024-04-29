const { EssayQuestion } = require("../models/Question");
const { FillInTheGapQuestion } = require("../models/Question");
const { MCQQuestion } = require("../models/Question");
const Student = require("../models/Student");


async function getQuestionsByCreator(req, res) {
    try {
        // Fetch questions from each collection and sort them based on createdBy field
        const essayQuestions = await EssayQuestion.find().sort('createdBy');
        const fillInTheGapQuestions = await FillInTheGapQuestion.find().sort('createdBy');
        const mcqQuestions = await MCQQuestion.find().sort('createdBy');

        // Combine the questions into a single array
        const allQuestions = [...essayQuestions, ...fillInTheGapQuestions, ...mcqQuestions];

        // Group questions by createdBy field
        const questionsByCreator = {};
        for (const question of allQuestions) {
            // Lookup the creator in the Student collection
            const student = await Student.findOne({ matricNumber: question.createdBy.toLowerCase() });
            if (student) {
                const creatorName = `${capitalize(student.firstName)} ${capitalize(student.lastName)}`;
                if (!questionsByCreator[creatorName]) {
                    questionsByCreator[creatorName] = [];
                }
                questionsByCreator[creatorName].push({
                    question: question.question,
                    type: question.constructor.modelName // The model name to determine question type
                });
            }
        }
        res.status(200).json({
            success: true,
            data: questionsByCreator
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

async function getQuestionsByCourseCode(req, res) {
    const { courseCode } = req.params;
    try {
        const essayQuestions = await EssayQuestion.find({ courseCode }).lean();
        const fillInTheGapQuestions = await FillInTheGapQuestion.find({ courseCode }).lean();
        const mcqQuestions = await MCQQuestion.find({ courseCode }).lean();

        const questionsWithTypes = essayQuestions.map(question => ({ ...question, type: 'Essay' }))
            .concat(fillInTheGapQuestions.map(question => ({ ...question, type: 'Fill in the Gap' })))
            .concat(mcqQuestions.map(question => ({ ...question, type: 'MCQ' })));

        res.status(200).json({
            success: true,
            data: questionsWithTypes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}
// Function to capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { getQuestionsByCreator, getQuestionsByCourseCode };
