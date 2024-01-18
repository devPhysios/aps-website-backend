const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors").default;


const register = async (req, res) => {
  const student = await Student.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user:{name:user.name}, token });
};

const login = async (req, res) => {
  const {matricNumber, password} = req.body;
  if (!matricNumber || !password) {
    throw new BadRequestError("Please provide Matric No and password");
  }
  const student = await Student.findOne({ matricNumber });
  if (!student) {
    throw new UnauthenticatedError("Student not found");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Password");
  }
  
  const token = student.createJWT();
  res.status(StatusCodes.OK).json({ student:{id:student._id, matricNumber:student.matricNumber, firstName:student.firstName, lastName:student.lastName, middleName:student.middleName, email:student.email, gender:student.gender, month:student.monthOfBirth, day:dayOfBirth, level:student.level, role:student.role, post:student.post, isAlumni:student.isAlumni, isExecutive:student.isExecutive, profilePicture:student.profilePicture, isFreshman:student.isFreshman, isFinalYear:student.isFinalYear, isClinicalStudent:student.isClinicalStudent, hallOfResidence:student.hallOfResidence, roomNo:student.roomNo, isAcademicCommittee:student.isAcademicCommittee}, token });
};

module.exports = { register, login };
