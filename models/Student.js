const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    trim: true,
    match: [/^[A-Za-z-]*$/, "Please enter a valid first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
    trim: true,
    match: [/^[A-Za-z-]*$/, "Please enter a valid last name"],
  },
  middleName: {
    type: String,
    required: [false],
    trim: true,
    match: [/^[A-Za-z-]*$/, "Please enter a valid middle name"],
  },
  email: {
    type: String,
    default: null,
    trim: true,
    // Activate this after populating the database
    // unique: [true, 'Email already exists'],
    // match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    trim: true,
    minlength: [2, "Password must be at least 6 characters long"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    default: null,
  },
  securityQuestion: {
    type: String,
    trim: true,
    default: null,
  },
  securityAnswer: {
    type: String,
    trim: true,
    default: null,
  },
  monthOfBirth: {
    type: Number,
    default: null,
    min: 1,
    max: 12,
  },
  dayOfBirth: {
    type: Number,
    default: null,
    min: 1,
    max: 31,
  },
  matricNumber: {
    type: String,
    required: [true, "Please enter your matric number"],
    trim: true,
    unique: [true, "Matric number already exists"],
    match: [/^[0-9]+$/, "Please enter a valid matric number"],
  },
  program: {
    type: String,
    default: "Physiotherapy",
  },
  isAcademicCommittee: {
    type: Boolean,
    default: false,
  },
  classSet: {
    type: String,
    default: null,
    required: [true, "Please enter your set"],
  },
  level: {
    type: String,
    enum: ["100", "200", "300", "400", "500"],
    required: [true, "Please enter your level"],
  },
  post: {
    type: Array,
    default: null,
  },
  isAlumni: {
    type: Boolean,
    default: false,
  },
  isExecutive: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  hallOfResidence: {
    type: String,
    default: null,
  },
  roomNo: {
    type: String,
    default: null,
  },
  isAcademicCommittee: {
    type: Boolean,
    default: false,
  },
  isSenator: {
    type: Boolean,
    default: false,
  },
  firstLogin: {
    type: Boolean,
    default: true,
  },
});

StudentSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (this.securityAnswer) {
    this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
  }
  next();
});


StudentSchema.methods.createJWT = function () {
  return jwt.sign(
    { studentId: this._id, matricNumber: this.matricNumber },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

StudentSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

StudentSchema.methods.compareSecurity = async function (securityAnswer) {
  
  const isMatch = await bcrypt.compare(securityAnswer, this.securityAnswer);
  return isMatch;
};


module.exports = mongoose.model("Student", StudentSchema);
