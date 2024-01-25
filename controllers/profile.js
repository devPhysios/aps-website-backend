const UnauthenticatedError = require("../errors/unauthenticated");
const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");

// TODO: Create the update and delete function

const updateStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const studentToUpdate = await Student.findById(id);

    if (!studentToUpdate) {
      throw new UnauthenticatedError("Student not found");
    }

    const student = await Student.findOneAndUpdate(
      studentToUpdate,
      { ...req.body },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
        student
    })
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

module.exports = {
    updateStudent
}
