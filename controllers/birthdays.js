const Student = require("../models/Student");
const Birthday = require("../models/Birthday");
const { StatusCodes } = require("http-status-codes");
const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const getStudentDetails = async (req, res) => {
  try {
    const { matricNumber: authMatricNumber } = req.student;
    console.log(authMatricNumber);
    const allowedMatricNumbers = ["213569", "220978"];
    if (!authMatricNumber || !allowedMatricNumbers.includes(authMatricNumber)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You're not permitted to perform this action" });
    }

    if (!req.params.studentMatricNumber) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request" });
    }
    const matricNumber = req.params.studentMatricNumber;
    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student Not Found" });
    }

    const studentData = {
      matricNumber: student.studentMatricNumber,
      fullName: `${capitalize(student.firstName)} ${
        student.middleName ? capitalize(student.middleName) + " " : ""
      }${capitalize(student.lastName)}`,
      level: student.level,
      classSet: student.classSet,
    };
    return res.status(StatusCodes.OK).json({ student: studentData });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const createStudentBirthday = async (req, res) => {
  try {
    const { matricNumber: authMatricNumber } = req.student;
    const allowedMatricNumbers = ["213569", "220978"];
    if (!authMatricNumber || !allowedMatricNumbers.includes(authMatricNumber)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You're not permitted to perform this action" });
    }

    const {
      matricNumber,
      fullName,
      birthdayMonth,
      birthdayDay,
      birthdayWish,
      level,
      classSet,
      imageUrl,
    } = req.body;

    if (
      !matricNumber ||
      !fullName ||
      !birthdayMonth ||
      !birthdayDay ||
      !birthdayWish ||
      !level ||
      !classSet ||
      !imageUrl
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request" });
    }

    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student Not Found" });
    }

    const birthday = await Birthday.create({
      matricNumber,
      fullName,
      birthdayMonth,
      birthdayDay,
      birthdayWish,
      level,
      classSet,
      imageUrl,
    });
    return res.status(StatusCodes.CREATED).json({
      message: "Birthday created successfully",
      success: true,
      birthday,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const updateStudentBirthday = async (req, res) => {
  try {
    const { matricNumber: authMatricNumber } = req.student;
    const allowedMatricNumbers = ["213569", "220978"];
    if (!authMatricNumber || !allowedMatricNumbers.includes(authMatricNumber)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You're not permitted to perform this action" });
    }
    const {
      matricNumber,
      fullName,
      birthdayMonth,
      birthdayDay,
      birthdayWish,
      level,
      classSet,
      imageUrl,
    } = req.body;

    if (
      !matricNumber ||
      !fullName ||
      !birthdayMonth ||
      !birthdayDay ||
      !birthdayWish ||
      !level ||
      !classSet ||
      !imageUrl
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request" });
    }

    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student Not Found" });
    }

    const birthday = await Birthday.findOneAndUpdate(
      { matricNumber },
      {
        matricNumber,
        fullName,
        birthdayMonth,
        birthdayDay,
        birthdayWish,
        level,
        classSet,
        imageUrl,
      },
      { new: true }
    );
    return res.status(StatusCodes.OK).json({
      message: "Birthday updated successfully",
      success: true,
      birthday,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getStudentBirthdays = async (req, res) => {
  try {
    // Get current date
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    // Find birthdays matching the current date
    const birthdays = await Birthday.find({
      birthdayMonth: currentMonth.toString(),
      birthdayDay: currentDay.toString(),
    });

    if (birthdays.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ birthdays: [], message: "No birthday events for today." });
    }

    return res.status(StatusCodes.OK).json({ birthdays });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getStudentBirthdaysByMatricNumber = async (req, res) => {
  try {
    const { matricNumber } = req.params;

    // Find the birthday event matching the matric number
    const birthday = await Birthday.findOne({ matricNumber });

    if (!birthday) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No birthday event found for the specified matric number." });
    }

    return res.status(StatusCodes.OK).json({ birthday });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getStudentBirthdaysByMatricNumberForEjs = async (req, res) => {
  try {
    const { famn } = req.params;
    const firstName = famn.slice(0, -3).toLowerCase();
    const lastThreeDigits = famn.slice(-3);
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const currentDay = currentDate.getDate().toString();
    const birthday = await Birthday.findOne({
      fullName: { $regex: new RegExp(`^${firstName}`, 'i') },
      matricNumber: { $regex: `${lastThreeDigits}$` },
      birthdayMonth: currentMonth,
      birthdayDay: currentDay
    });

    if (!birthday) {
      return null;
    }

    return birthday;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
};

const getBirthdaysByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    if (!month) {
      return res.status(400).json({ message: "Please provide a month" });
    }
    const capitalizedMonth = capitalize(month);
    const students = await Student.find({ monthOfBirth: capitalizedMonth });
    const birthdayStudents = students.map((student) => ({
      fullName: `${capitalize(student.firstName)} ${capitalize(
        student.middleName
      )} ${capitalize(student.lastName)}`,
      matricNumber: student.matricNumber,
      monthOfBirth: student.monthOfBirth,
      dayOfBirth: student.dayOfBirth,
      level: student.level,
    }));

    // Send the response and total number of students
    return res.status(200).json({
      message: `${birthdayStudents.length} students found`,
      students: birthdayStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving students' birthdays.",
    });
  }
};

const getAllBirthdayEvents = async (req, res) => {
  try {
    const { matricNumber: authMatricNumber } = req.student;
    const allowedMatricNumbers = ["213569", "220978"];
    if (!authMatricNumber || !allowedMatricNumbers.includes(authMatricNumber)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You're not permitted to perform this action" });
    }

    const birthdays = await Birthday.find();
    if (birthdays.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ birthdays: [], message: "No birthday events available" });
    }

    return res.status(StatusCodes.OK).json({ birthdays });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const deleteStudentBirthday = async (req, res) => {
  try {
    const { matricNumber: authMatricNumber } = req.student;
    const allowedMatricNumbers = ["213569", "220978"];
    if (!authMatricNumber || !allowedMatricNumbers.includes(authMatricNumber)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You're not permitted to perform this action" });
    }

    const { matricNumber } = req.body;

    if (!matricNumber) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request" });
    }

    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Student Not Found" });
    }

    const birthday = await Birthday.findOneAndDelete({ matricNumber });

    if (!birthday) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Birthday Not Found" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Birthday deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getStudentDetails,
  createStudentBirthday,
  updateStudentBirthday,
  getStudentBirthdays,
  getAllBirthdayEvents,
  deleteStudentBirthday,
  getBirthdaysByMonth,
  getStudentBirthdaysByMatricNumber,
  getStudentBirthdaysByMatricNumberForEjs
};
