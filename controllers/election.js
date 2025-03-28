const Student = require("../models/Student");

// @desc    Get all students for election
// @route   GET /api/election/students
// @access  Private
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select(
      "firstName lastName middleName matricNumber gender classSet level"
    );
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get student by matric number for election
// @route   GET /api/election/students/:matricNumber
// @access  Private
const getStudentByMatricNumber = async (req, res) => {
  try {
    const student = await Student.findOne({
      matricNumber: req.params.matricNumber,
    }).select(
      "firstName lastName middleName matricNumber gender classSet level"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentByMatricNumber,
};
