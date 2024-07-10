const Student = require("../models/Student");
const Alumnus = require("../models/Alumnus");
const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// Controller function to copy 500L students to Alumni collection
const createAlumni = async (req, res) => {
  try {
    // Find all students in 500L
    const students = await Student.find({ level: "500" });

    // Map student data to match Alumnus schema
    const alumniData = students.map((student) => {
      return {
        firstName: student.firstName,
        lastName: student.lastName,
        middleName: student.middleName,
        email: student.email,
        password: student.password,
        gender: student.gender,
        securityQuestion: student.securityQuestion,
        securityAnswer: student.securityAnswer,
        monthOfBirth: student.monthOfBirth,
        dayOfBirth: student.dayOfBirth,
        matricNumber: student.matricNumber,
        program: student.program,
        classSet: student.classSet,
        postHeld: student.post,
        isPastExecutive: student.isExecutive,
        profilePicture: student.profilePicture,
        isPastSenator: student.isSenator,
        firstLogin: student.firstLogin,
        hobbies: student.hobbies,
        skills: student.skills,
        phoneNumber: student.phoneNumber,
      };
    });

    // Save mapped data to Alumnus collection
    const savedAlumni = await Alumnus.insertMany(alumniData);

    res
      .status(200)
      .json({
        success: true,
        data: savedAlumni,
        message: `${savedAlumni.length} Alumni created successfully`,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllAlumni = async (req, res) => {
    try {
      // Fetch all alumni from the database
      const alumni = await Alumnus.find({});
  
      // Map alumni data to exclude sensitive fields and format the full name
      const formattedAlumni = alumni.map(alumnus => {
        const fullName = `${capitalize(alumnus.firstName)} ${alumnus.middleName ? capitalize(alumnus.middleName) + ' ' : ''}${capitalize(alumnus.lastName)}`;
  
        return {
          fullName: fullName.trim(),
          email: alumnus.email,
          gender: alumnus.gender,
          monthOfBirth: alumnus.monthOfBirth,
          dayOfBirth: alumnus.dayOfBirth,
          matricNumber: alumnus.matricNumber,
          program: alumnus.program,
          classSet: alumnus.classSet,
          postHeld: alumnus.postHeld,
          isPastExecutive: alumnus.isPastExecutive,
          profilePicture: alumnus.profilePicture,
          isPastSenator: alumnus.isPastSenator,
          hobbies: alumnus.hobbies,
          skills: alumnus.skills,
          phoneNumber: alumnus.phoneNumber
        };
      });
  
      res.status(200).json({ success: true, data: formattedAlumni });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
module.exports = { createAlumni, getAllAlumni};
