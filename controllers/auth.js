const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");


const register = async (req, res) => {
  const student = await Student.create({ ...req.body });
  const token = student.createJWT();
  res.status(StatusCodes.CREATED).json({ student: { name: student.matricNumber }, token });
};

// For populating the database with APS students

// const registerMultipleStudents = async (req, res) => {
//   try {
//     const studentsData = require('../populate300L.json');
//     const createdStudents = await Promise.all(
//       studentsData.map(async (studentData) => {
//         const student = await Student.create(studentData);
//         return { name: student.matricNumber };
//       })
//     );
//     res.status(201).json({ students: createdStudents });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const login = async (req, res) => {
  const { matricNumber, password } = req.body;
  if (!matricNumber || !password) {
    throw new BadRequestError("Please provide Matric No and password");
  }
  const student = await Student.findOne({ matricNumber });
  if (!student) {
    throw new UnauthenticatedError("Student not found");
  }
  const isPasswordCorrect = await student.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Password");
  }

  const token = student.createJWT();
  res.status(StatusCodes.OK).json({ student: { id: student._id, matricNumber: student.matricNumber, firstName: student.firstName, lastName: student.lastName, middleName: student.middleName, email: student.email, gender: student.gender, month: student.monthOfBirth, day: student.dayOfBirth, level: student.level, post: student.post, isAlumni: student.isAlumni, isExecutive: student.isExecutive, profilePicture: student.profilePicture, hallOfResidence: student.hallOfResidence, roomNo: student.roomNo, isAcademicCommittee: student.isAcademicCommittee, isSenator: student.isSenator }, token });
};

module.exports = { register, login };
