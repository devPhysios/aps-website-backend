const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const { MCQQuestion } = require("../models/Question"); // Assuming the model file is in the '../models' directory

const createQuestion = async (req, res) => {
  try {
    // Check if the student is a member of the academic committee
    const { matricNumber } = req.student;
    // Find the student based on the provided matricNumber
    const student = await Student.findOne({ matricNumber });
    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student not found" });
    }

    // Check if the student is a member of the academic committee
    if (!student.isAcademicCommittee) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error:
          "Unauthorized: Only members of the academic committee can create MCQ questions",
      });
    }
    const {
      question,
      imgURL,
      options,
      answer,
      courseCode,
      level,
      year,
      tags,
      lecturer,
    } = req.body;
    const mcqQuestion = new MCQQuestion({
      question,
      imgURL,
      options,
      answer,
      courseCode,
      level,
      year,
      tags,
      createdBy: student.matricNumber,
      lecturer,
    });

    await mcqQuestion.save();

    return res.status(StatusCodes.CREATED).json({
      message: "MCQ question created successfully",
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getQuestions = async (req, res) => {
  try {
    let { courseCode, page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 30;

    // Query for fetching questions based on course code, with pagination and sorting by year
    const questions = await MCQQuestion.find({ courseCode })
      .sort({ year: -1 })
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(StatusCodes.OK).json({
      message: "Fill in the gap questions fetched successfully",
      questions,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getCustomQuestions = async (req, res) => {
  try {
    let { level, courseCode, tags, createdBy, year, _id, page, limit } =
      req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 30;

    const filter = {};
    if (level) {
      filter.level = level;
    }
    if (courseCode) {
      filter.courseCode = courseCode;
    }
    if (tags) {
      filter.tags = tags;
    }
    if (createdBy) {
      filter.createdBy = createdBy;
    }
    if (year) {
      filter.year = year;
    }
    if (_id) {
      filter._id = _id;
    }

    const questions = await MCQQuestion.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const editQuestion = async (req, res) => {
  try {
    const { matricNumber } = req.student;
    const { id } = req.params;

    //Find the student based on the provided matricNumber
    const student = await Student.findOne({ matricNumber });
    if (!student)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student not found" });

    // Check if the student is a member of the academic committee
    if (!student.isAcademicCommittee) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({
          error:
            "You're not authorized to perform this task. Kindly contact the General Secretary",
        });
    }

    // Find the question by ID
    const question = await MCQQuestion.findById(id);
    if (!question) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Question not found" });
    }

    // Check if the student's level matches the question's level
    // if (student.level !== question.level) {
    //   return res
    //     .status(StatusCodes.FORBIDDEN)
    //     .json({
    //       error: "Forbidden: Student level does not match question level",
    //     });
    // }

    // Update the question
    const {
      question: updatedQuestion,
      imgURL,
      answer,
      courseCode,
      year,
      tags,
      lecturer,
      options,
    } = req.body;
    question.question = updatedQuestion;
    question.options = options;
    question.imgURL = imgURL;
    question.answer = answer;
    question.courseCode = courseCode;
    question.year = year;
    question.tags = tags;
    question.lecturer = lecturer;
    question.updatedTimeHistory.push(Date.now());
    question.updatedStudentHistory.push(student.matricNumber);

    await question.updateOne(question);
    res
      .status(StatusCodes.OK)
      .json({ message: "Question updated successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    // Extract relevant information from request
    const { matricNumber } = req.student;
    const { id } = req.params;

    //Find the student based on the provided matricNumber
    const student = await Student.findOne({ matricNumber });
    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student not found" });
    }

    // Find the question by ID
    const question = await MCQQuestion.findById(id);
    if (!question) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Question not found" });
    }

    // Check if the student is a member of the academic committee
    if (!student.isAcademicCommittee) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error:
          "You're not authorized to perform this task. Kindly contact the General Secretary",
      });
    }

    // Check if the student's level matches the question's level
    // if (student.level !== question.level) {
    //   return res.status(StatusCodes.FORBIDDEN).json({
    //     error: "Forbidden: Student level does not match question level",
    //   });
    // }

    // Delete the question
    await question.delete();

    res
      .status(StatusCodes.OK)
      .json({ message: "Question deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getCustomQuestions,
  editQuestion,
  deleteQuestion,
};
