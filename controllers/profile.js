const UnauthenticatedError = require("../errors/unauthenticated");
const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");

const updateStudent = async (req, res) => {
  const { matricNumber } = req.student;

  const {
    monthOfBirth,
    dayOfBirth,
    hobbies,
    email,
    gender,
    hallOfResidence,
    roomNo,
    profilePicture,
    phoneNumber,
    skills,
  } = req.body;
  try {
    const studentToUpdate = await Student.findOne({ matricNumber });

    if (!studentToUpdate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student not found" });
    }

    const student = await Student.findOneAndUpdate(
      { matricNumber },
      {
        $set: {
          monthOfBirth,
          dayOfBirth,
          hobbies,
          email,
          gender,
          hallOfResidence,
          roomNo,
          profilePicture,
          skills,
          phoneNumber,
        },
      },
      { new: true }
    ).select("-password -securityQuestion -securityAnswer");

    res.status(StatusCodes.OK).json({
      student,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const getStudentDetails = async (req, res) => {
  const { id } = req.query;
  try {
    const student = await Student.findById(id);

    if (!student) {
      throw new UnauthenticatedError("Student not found");
    }
    res.status(StatusCodes.OK).json({
      student,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

module.exports = {
  updateStudent,
  getStudentDetails,
};
