const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

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

const registerMultipleStudents = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const studentsData = require('../classes/2k26.json');

    // Create or update students
    const createdStudents = await Promise.all(
      studentsData.map(async (studentData) => {
        const student = await Student.findOneAndUpdate(
          { matricNumber: studentData.matricNumber },
          studentData,
          { new: true, upsert: true, session }
        );
        return { name: student.matricNumber };
      })
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      students: createdStudents,
      message: `${createdStudents.length} students created successfully!`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//delete all students of a particular level

const deleteStudentLevel = async (req, res) => {
  try {
    // Validate input
    const { level } = req.body;
    if (!level) {
      return res.status(400).json({ error: "Level is required" });
    }

    // Delete students
    const deletedStudents = await Student.deleteMany({ level });

    // Return response
    return res.status(200).json({
      message: `${deletedStudents.deletedCount} students deleted from the database`,
      deletedStudents: deletedStudents,
    });
  } catch (error) {
    console.error("Error deleting students:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { matricNumber, password } = req.body;
    if (!matricNumber || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Matric number and password are required.",
      });
    }

    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: "Student not found.",
      });
    }

    const isPasswordCorrect = await student.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: "Incorrect password.",
      });
    }

    const token = student.createJWT();
    student.forceLogout = false;

    await student.save();

    const updatedStudent = await Student.findOne({ matricNumber });
    const baseStudentData = {
      id: student._id,
      matricNumber: student.matricNumber,
      firstLogin: student.firstLogin,
      isAcademicCommittee: student.isAcademicCommittee,
    };

    const extendedStudentData = student.firstLogin
      ? {
          fullName: `${capitalize(student.firstName)} ${
            student.middleName ? capitalize(student.middleName) + " " : ""
          }${capitalize(student.lastName)}`,
        }
      : {
          firstName: student.firstName,
          lastName: student.lastName,
          middleName: student.middleName,
          email: student.email,
          gender: student.gender,
          monthOfBirth: student.monthOfBirth,
          dayOfBirth: student.dayOfBirth,
          level: student.level,
          post: student.post,
          isAlumni: student.isAlumni,
          isExecutive: student.isExecutive,
          profilePicture: student.profilePicture,
          hallOfResidence: student.hallOfResidence,
          roomNo: student.roomNo,
          isSenator: student.isSenator,
          classSet: student.classSet,
          program: student.program,
          hobbies: student.hobbies,
          phoneNumber: student.phoneNumber,
          skills: student.skills,
          forceLogout: student.forceLogout,
        };

    const responseData = {
      token,
      student: { ...baseStudentData, ...extendedStudentData },
    };

    res.status(StatusCodes.OK).json({ responseData, success: true });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      success: false,
    });
  }
};

const changePasswordAndSecurityQuestion = async (req, res) => {
  try {
    const { oldPassword, newPassword, securityQuestion, securityAnswer } =
      req.body;
    const { matricNumber } = req.student;

    // Check if all required fields are provided
    if (!oldPassword || !newPassword || !securityQuestion || !securityAnswer) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error:
          "Please provide old password, new password, security question, and security answer",
      });
    }

    const student = await Student.findOne({ matricNumber });
    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: "Student not found" });
    }

    // Verify the old password
    const isPasswordCorrect = await student.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, error: "Invalid Old Password" });
    }

    // Update the password and security question/answer
    student.password = newPassword;
    student.securityQuestion = securityQuestion;
    student.securityAnswer = securityAnswer;
    student.firstLogin = false;
    await student.save();

    // Respond with success message
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password and security question updated successfully!",
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { matricNumber } = req.student;

    // Check if all required fields are provided
    if (!oldPassword || !newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Please provide old password and new password",
      });
    }

    // Find the student based on the provided matricNumber
    const student = await Student.findOne({ matricNumber });
    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: "Student not found" });
    }

    // Verify the old password
    const isPasswordCorrect = await student.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, error: "Invalid Old Password" });
    }

    // Update the password
    student.password = newPassword;
    await student.save();

    // Respond with success message
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // Handle errors
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { securityQuestion, securityAnswer, matricNumber } = req.body;
    // Check if all required fields are provided
    if (!matricNumber || !securityQuestion || !securityAnswer) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error:
          "Please provide your Matric Number, security question, and security answer",
      });
    }

    // Find the student based on the provided matricNumber
    const student = await Student.findOne({ matricNumber }).select(
      "+securityAnswer"
    );
    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: "Student not found" });
    }

    // check if the student has a security question and answer
    if (!student.securityQuestion || !student.securityAnswer) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "You have not set a security question and answer",
      });
    }

    // Compare the security answer
    const isSecurityAnswerCorrect = await student.compareSecurity(
      securityAnswer
    );
    // Check if the security question and answer match
    if (
      student.securityQuestion !== securityQuestion ||
      !isSecurityAnswerCorrect
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: "Invalid Security Question or Security Answer",
      });
    }

    // Update the password
    student.password = student.lastName;
    student.firstLogin = true;
    await student.save();

    // Respond with success message
    res.status(StatusCodes.OK).json({
      success: true,
      message:
        "Password reset successfully. Your surname is now your password. Please update it. Thanks",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const resetAllPasswords = async (req, res) => {
  // try {
  //   const students = await Student.find();
  //   students.forEach(async (student) => {
  //     student.password = student.lastName;
  //     student.securityAnswer = null;
  //     student.securityQuestion = null;
  //     student.firstLogin = true;
  //     await student.save();
  //   });
  //   res
  //     .status(StatusCodes.OK)
  //     .json({ success: true, message: "All passwords reset successfully" });
  // } catch (error) {
  //   console.error(error);
  //   res
  //     .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //     .json({ error: error.message });
  // }
};

const validToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Not authorized to access this route" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const matricNumber = payload.matricNumber;
    console.log(matricNumber);
    const student = await Student.findOne({ matricNumber });
    if (!student) {
      console.log("student not found");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid or expired token" });
    }
    const isTokenValid = await bcrypt.compare(token, student.validToken);
    if (!isTokenValid) {
      console.log("token not valid");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid or expired token" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Token is valid" });
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid or expired token" });
  }
};

const updateStudentProfiles = async (req, res) => {
  // try {
  //   // Read profile.json file
  //   const studentsProfile = require("../profile.json"); // Ensure the path is correct
  //   let updatedCount = 0;
  //   const updatedMatricNumbers = [];
  //   const notUpdatedMatricNumbers = [];
  //   for (const studentData of studentsProfile) {
  //     const { matriculationNumber, ...updateFields } = studentData;
  //     // Find the student by matric number and update their data
  //     const result = await Student.findOneAndUpdate(
  //       { matricNumber: matriculationNumber },
  //       { $set: updateFields },
  //       { new: true, runValidators: true }
  //     );
  //     if (result) {
  //       updatedCount++;
  //       updatedMatricNumbers.push(matriculationNumber);
  //     } else {
  //       notUpdatedMatricNumbers.push(matriculationNumber);
  //     }
  //   }
  //   // Send the response
  //   res.status(200).json({
  //     message: `${updatedCount} student profiles updated successfully.`,
  //     updatedMatricNumbers,
  //     notUpdatedCount: notUpdatedMatricNumbers.length,
  //     notUpdatedMatricNumbers,
  //   });
  // } catch (error) {
  //   console.error(error);
  //   res
  //     .status(500)
  //     .json({ message: "An error occurred while updating student profiles." });
  // }
};

// check if student should be logged out
const checkForceLogOut = async (req, res) => {
  try {
    const { matricNumber } = req.student;
    const student = await Student.findOne({ matricNumber });
    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, error: "Student not found" });
    }
    if (student.forceLogout === false) {
      return res
        .status(StatusCodes.OK)
        .json({ success: true, forceLogout: false });
    } else {
      return res
        .status(StatusCodes.OK)
        .json({ success: true, forceLogout: true });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  login,
  changePasswordAndSecurityQuestion,
  changePassword,
  resetPassword,
  registerMultipleStudents,
  deleteStudentLevel,
  resetAllPasswords,
  validToken,
  updateStudentProfiles,
  checkForceLogOut
};
