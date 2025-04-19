const mongoose = require("mongoose");

const ProjectTopicSchema = new mongoose.Schema({
  author: {
    name: {
      type: String,
      required: [true, "Author's name is required"],
      trim: true,
    },
    matricNumber: {
      type: String,
      default: "unknown",
      trim: true,
    },
  },
  supervisor: {
    name: {
      type: String,
      default: "unknown",
      trim: true,
    },
    title: {
      type: String,
      default: "unknown",
      trim: true,
      enum: {
        values: ["Dr.", "Prof.", "Mr.", "Miss", "Mrs."],
        message: "Supervisor title must be one of: Dr., Prof., Mr., Miss, Mrs.",
      },
    },
  },
  year: {
    type: Number,
    required: [true, "Project year is required"],
  },
  topic: {
    type: String,
    required: [true, "Project topic is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Normalize supervisor title before saving
ProjectTopicSchema.pre("save", function (next) {
  if (this.supervisor.title && this.supervisor.title !== "unknown") {
    // Convert to lowercase for consistent comparison
    const title = this.supervisor.title.toLowerCase().trim();

    // Handle different variations of the titles
    if (title === "professor" || title === "prof" || title === "prof.") {
      this.supervisor.title = "Prof.";
    } else if (title === "doctor" || title === "dr" || title === "dr.") {
      this.supervisor.title = "Dr.";
    } else if (title === "mister" || title === "mr" || title === "mr.") {
      this.supervisor.title = "Mr.";
    } else if (title === "miss" || title === "miss.") {
      this.supervisor.title = "Miss";
    } else if (title === "mrs" || title === "mrs.") {
      this.supervisor.title = "Mrs.";
    }
  }

  this.updatedAt = Date.now();
  next();
});

// Normalize supervisor title before updating
ProjectTopicSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (
    update.supervisor &&
    update.supervisor.title &&
    update.supervisor.title !== "unknown"
  ) {
    const title = update.supervisor.title.toLowerCase().trim();

    if (title === "professor" || title === "prof" || title === "prof.") {
      update.supervisor.title = "Prof.";
    } else if (title === "doctor" || title === "dr" || title === "dr.") {
      update.supervisor.title = "Dr.";
    } else if (title === "mister" || title === "mr" || title === "mr.") {
      update.supervisor.title = "Mr.";
    } else if (title === "miss" || title === "miss.") {
      update.supervisor.title = "Miss";
    } else if (title === "mrs" || title === "mrs.") {
      update.supervisor.title = "Mrs.";
    }
  }

  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model("ProjectTopic", ProjectTopicSchema);
