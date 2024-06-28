const mongoose = require("mongoose");

const BirthdaySchema = new mongoose.Schema({
  matricNumber: {
    type: String,
    required: [true, "Please enter the student's matric number"],
    trim: true,
  },
  fullName: {
    type: String,
    required: [true, "Please enter the student's full name"],
    trim: true,
  },
  birthdayMonth: {
    type: String,
    required: [true, "Please enter the student's birthday month"],
  },
  birthdayDay: {
    type: String,
    required: [true, "Please enter the student's birthday day"],
  },
  classSet: {
    type: String,
    required: [true, "Please enter the student's class set"],
  },
  level: {
    type: String,
    required: [true, "Please enter the student's level"],
  },
  birthdayWish: {
    type: String,
    required: [true, "Please enter the birthday wish"],
  },
  imageUrl: {
    type: String,
    required: [true, "Please enter the image url"],
  }
});

module.exports = mongoose.model("Birthday", BirthdaySchema);
