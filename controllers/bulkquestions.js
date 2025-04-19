//bulk questions controller

const {
  MCQQuestion,
  FillInTheGapQuestion,
  EssayQuestion,
} = require("../models/Question");
const { StatusCodes } = require("http-status-codes");
const Student = require("../models/Student");

const createBulkQuestions = async (req, res) => {
  try {
    // Check if the student is a member of the academic committee
    const { matricNumber } = req.student;
    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student not found" });
    }

    if (!student.isAcademicCommittee) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error:
          "Unauthorized: Only members of the academic committee can create questions",
      });
    }

    const { questions } = req.body;
    if (!questions || !Array.isArray(questions)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Invalid request format. Expected an array of questions",
      });
    }

    const results = {
      success: [],
      errors: [],
    };

    for (const question of questions) {
      try {
        // Validate required fields
        if (
          !question.type ||
          !question.question ||
          !question.courseCode ||
          !question.level ||
          !question.year
        ) {
          throw new Error("Missing required fields");
        }

        // Validate question type
        if (!["mcq", "fitg", "essay"].includes(question.type)) {
          throw new Error("Invalid question type");
        }

        // Validate type-specific fields
        if (
          question.type === "mcq" &&
          (!question.options || !question.answer)
        ) {
          throw new Error("MCQ questions require options and answer fields");
        }

        if (question.type === "fitg" && !question.answer) {
          throw new Error("FITG questions require an answer field");
        }

        const questionData = {
          question: question.question,
          imgURL: question.imgURL || null,
          courseCode: question.courseCode,
          level: question.level,
          year: question.year,
          tags: question.tags || [],
          createdBy: student.matricNumber,
          lecturer: question.lecturer || null,
          updatedTimeHistory: [],
          updatedStudentHistory: [],
        };

        let savedQuestion;

        switch (question.type) {
          case "mcq":
            savedQuestion = await MCQQuestion.create({
              ...questionData,
              options: question.options,
              answer: question.answer,
            });
            break;

          case "fitg":
            savedQuestion = await FillInTheGapQuestion.create({
              ...questionData,
              answer: question.answer,
            });
            break;

          case "essay":
            savedQuestion = await EssayQuestion.create({
              ...questionData,
              answer: question.answer || null,
            });
            break;
        }

        results.success.push({
          id: savedQuestion._id,
          type: question.type,
        });
      } catch (error) {
        results.errors.push({
          question: question.question,
          error: error.message,
        });
      }
    }

    return res.status(StatusCodes.CREATED).json({
      message: "Bulk questions processed",
      results,
    });
  } catch (error) {
    console.error("Error in createBulkQuestions:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  createBulkQuestions,
};
