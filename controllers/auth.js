const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const fs = require("fs");

// const register = async (req, res) => {
//   const student = await Student.create({ ...req.body });
//   const token = student.createJWT();
//   res
//     .status(StatusCodes.CREATED)
//     .json({ student: { name: student.matricNumber }, token });
// };

// fecth and store students based on their levels in a file

// async function fetchAndStoreStudents() {
//   try {
//     // 1. Fetch all 100L students
//     const students = await Student.find({ level: '100' });
//     // 2. Convert student data to JSON format
//     const studentsJSON = JSON.stringify(students);

//     // 3. Write the JSON data to the file
//     fs.writeFileSync('populate100L.json', studentsJSON);

//     console.log('100L student data successfully stored in populate100L.json');
//   } catch (error) {
//     console.error('Error fetching and storing students:', error);
//   }
// }

// For populating the database with APS students

// const registerMultipleStudents = async (req, res) => {
//   try {
//     const studentsData = require("../populate300L.json");
//     const createdStudents = await Promise.all(
//       studentsData.map(async (studentData) => {
//         const student = await Student.create(studentData);
//         return { name: student.matricNumber };
//       })
//     );
//     res
//       .status(201)
//       .json({
//         students: createdStudents,
//         message: `${createdStudents.length} students created successfully!`,
//       });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const login = async (req, res) => {
  try {
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

    let responseData = {
      token,
    };

    if (student.firstLogin) {
      responseData.student = {
        id: student._id,
        firstLogin: student.firstLogin,
        matricNumber: student.matricNumber,
        name: student.firstName + (student.middleName ? ' ' + student.middleName : '') + ' ' + student.lastName,
      };
    } else {
      responseData.student = {
        firstLogin: student.firstLogin,
        id: student._id,
        matricNumber: student.matricNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        middleName: student.middleName,
        email: student.email,
        gender: student.gender,
        month: student.monthOfBirth,
        day: student.dayOfBirth,
        level: student.level,
        post: student.post,
        isAlumni: student.isAlumni,
        isExecutive: student.isExecutive,
        profilePicture: student.profilePicture,
        hallOfResidence: student.hallOfResidence,
        roomNo: student.roomNo,
        isAcademicCommittee: student.isAcademicCommittee,
        isSenator: student.isSenator,
      };
    }

    res.status(StatusCodes.OK).json(responseData);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const changePasswordAndSecurityQuestion = async (req, res) => {
  try {
    const { matricNumber, oldPassword, newPassword, securityQuestion, securityAnswer } = req.body;
    if (!matricNumber || !oldPassword || !newPassword || !securityQuestion || !securityAnswer) {
      throw new BadRequestError("Please provide Matric No, old password, new password, security question, and security answer");
    }

    const student = await Student.findOne({ matricNumber });
    if (!student) {
      throw new UnauthenticatedError("Student not found");
    }

    const isPasswordCorrect = await student.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Old Password");
    }

    student.password = newPassword;
    await student.save();

    student.securityQuestion = securityQuestion;
    student.securityAnswer = securityAnswer;
    await student.save();

    res.status(StatusCodes.OK).json({ success: true, message: "Password and security question updated successfully!"});
  } catch (error) {

    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { matricNumber, oldPassword, newPassword } = req.body;
    if (!matricNumber || !oldPassword || !newPassword) {
      throw new BadRequestError("Please provide Matric No, old password, and new password");
    }

    const student = await Student.findOne({ matricNumber });
    if (!student) {
      throw new UnauthenticatedError("Student not found");
    }

    const isPasswordCorrect = await student.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Old Password");
    }
    student.password = newPassword;
    await student.save();

    res.status(StatusCodes.OK).json({success:true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { matricNumber, newPassword, securityQuestion, securityAnswer } = req.body;
    if (!matricNumber || !newPassword || !securityQuestion || !securityAnswer) {
      throw new BadRequestError("Please provide Matric No, new password, security question, and security answer");
    }

    const student = await Student.findOne({ matricNumber });
    if (!student) {
      throw new UnauthenticatedError("Student not found");
    }

    if (student.securityQuestion !== securityQuestion || student.securityAnswer !== securityAnswer) {
      throw new UnauthenticatedError("Security question or answer is incorrect");
    }

    student.password = newPassword;
    await student.save();

    res.status(StatusCodes.OK).json({ success: true, message: "Password reset successfully"});
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};



module.exports = { login, changePasswordAndSecurityQuestion, changePassword, resetPassword };
