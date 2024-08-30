const Student = require("../models/Student");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Alumnus = require("../models/Alumnus");

const updateAcademicCommitteeStatus = async (req, res) => {
  const { matricNumber } = req.body;

  try {
    // Find the student by matricNumber
    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the isAcademicCommittee field
    student.isAcademicCommittee = true;

    // Save the updated student object
    await student.updateOne(student);

    // Return the name of the student along with success message
    return res.status(200).json({
      message: "Academic committee status updated successfully",
      name: `${student.firstName} ${student.lastName}`,
    });
  } catch (error) {
    console.error("Error updating academic committee status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateMatricNumber = async (req, res) => {
  // const { matricNumber1, matricNumber2 } = req.body;
  // const placeholderMatricNumber = "5648893874"; // Temporary placeholder value
  // try {
  //   // Find both students by their matric numbers
  //   const student1 = await Student.findOne({ matricNumber: matricNumber1 });
  //   const student2 = await Student.findOne({ matricNumber: matricNumber2 });
  //   if (!student1 || !student2) {
  //     return res
  //       .status(404)
  //       .json({ message: "One or both students not found" });
  //   }
  //   // Step 1: Temporarily set the first student's matric number to the placeholder value
  //   student1.matricNumber = placeholderMatricNumber;
  //   await student1.save();
  //   // Step 2: Update the second student's matric number to the first student's original matric number
  //   student2.matricNumber = matricNumber1;
  //   await student2.save();
  //   // Step 3: Update the first student's matric number to the second student's original matric number
  //   student1.matricNumber = matricNumber2;
  //   await student1.save();
  //   // Return the names of the students along with success message
  //   return res.status(200).json({
  //     message: "Matric numbers swapped successfully",
  //     students: [
  //       {
  //         name: `${student1.firstName} ${student1.lastName}`,
  //         matricNumber: student1.matricNumber,
  //       },
  //       {
  //         name: `${student2.firstName} ${student2.lastName}`,
  //         matricNumber: student2.matricNumber,
  //       },
  //     ],
  //   });
  // } catch (error) {
  //   console.error("Error swapping matric numbers:", error);
  //   return res.status(500).json({ message: "Internal server error" });
  // }
};

const updateStudentProfilesFromJson = async (req, res) => {
  // const filePath = path.join(__dirname, "..", "output.json");
  // try {
  //   // Read and parse the JSON file
  //   const data = fs.readFileSync(filePath, "utf8");
  //   const students = JSON.parse(data);
  //   let updatedCount = 0;
  //   let failedCount = 0;
  //   const failedMatricNumbers = [];
  //   // Loop through each student in the JSON data
  //   for (const studentData of students) {
  //     const {
  //       matriculationNumber,
  //       emailAddress,
  //       gender,
  //       phoneNumber,
  //       hallOfResidence,
  //       skills,
  //       monthOfBirth,
  //       dayOfBirth,
  //     } = studentData;
  //     try {
  //       // Find the student by matriculation number
  //       const student = await Student.findOne({
  //         matricNumber: matriculationNumber,
  //       });
  //       if (student) {
  //         // Update the student's profile
  //         student.email = emailAddress
  //         student.gender = gender;
  //         student.phoneNumber = phoneNumber;
  //         student.hallOfResidence = hallOfResidence
  //         student.skills = skills;
  //         student.monthOfBirth = monthOfBirth;
  //         student.dayOfBirth = dayOfBirth;
  //         // Save the updated student profile
  //         await student.save();
  //         updatedCount++;
  //       } else {
  //         failedCount++;
  //         failedMatricNumbers.push(matriculationNumber);
  //       }
  //     } catch (error) {
  //       console.error(
  //         `Error updating student with matric number ${matriculationNumber}:`,
  //         error
  //       );
  //       failedCount++;
  //       failedMatricNumbers.push(matriculationNumber);
  //     }
  //   }
  //   return res.status(200).json({
  //     message: "Student profiles update process completed",
  //     updatedCount,
  //     failedCount,
  //     failedMatricNumbers,
  //   });
  // } catch (error) {
  //   console.error("Error reading or parsing JSON file:", error);
  //   return res.status(500).json({ message: "Internal server error" });
  // }
};

const promoteStudents = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  // try {
  //   const removedStudents = await Student.deleteMany({ level: "500" }).session(session);
  //   const levels = ["100", "200", "300", "400"];
  //   const promotionDetails = {};
  //   for (let i = levels.length - 1; i >= 0; i--) {
  //     const currentLevel = levels[i];
  //     const nextLevel = (parseInt(currentLevel) + 100).toString();
  //     const { modifiedCount } = await Student.updateMany(
  //       { level: currentLevel },
  //       { $set: { level: nextLevel } },
  //       { session }
  //     );
  //     promotionDetails[currentLevel] = modifiedCount;
  //   }
  //   await session.commitTransaction();
  //   session.endSession();
  //   const totalPromoted = Object.values(promotionDetails).reduce((sum, count) => sum + count, 0);
  //   return res.status(200).json({
  //     message: `${totalPromoted} students promoted successfully`,
  //     promotions: promotionDetails,
  //     removedStudents: removedStudents.deletedCount,
  //   });
  // } catch (error) {
  //   await session.abortTransaction();
  //   session.endSession();
  //   console.error("Error promoting students:", error);
  //   return res.status(500).json({ message: "Internal server error" });
  // }
};

const resetPasswordsToLastName = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  // try {
  //   const students = await Student.find({}).session(session);
  //   for (const student of students) {
  //     student.password = student.lastName.toLowerCase();
  //     student.firstLogin = true;
  //     await student.save({ session });
  //     const updatedStudent = await Student.findById(student._id).session(session);
  //     // console.log(`Password for ${student.matricNumber} (${student.lastName}) reset and re-hashed value: ${updatedStudent.password}`);
  //   }
  //   await session.commitTransaction();
  //   session.endSession();
  //   return res.status(200).json({
  //     message: "All student passwords have been reset to their last names.",
  //   });
  // } catch (error) {
  //   await session.abortTransaction();
  //   session.endSession();
  //   console.error("Error resetting passwords:", error);
  //   return res.status(500).json({ message: "Internal server error" });
  // }
};

module.exports = {
  updateAcademicCommitteeStatus,
  updateMatricNumber,
  updateStudentProfilesFromJson,
  promoteStudents,
  resetPasswordsToLastName,
};
