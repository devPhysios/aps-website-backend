const ProjectTopic = require("../models/ProjectTopic");
const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");

// Helper function to validate project topic data
const validateProjectTopic = (topic) => {
  if (!topic.author || !topic.author.name) {
    return { isValid: false, message: "Author's name is required" };
  }
  if (!topic.year) {
    return { isValid: false, message: "Project year is required" };
  }
  if (!topic.topic) {
    return { isValid: false, message: "Project topic is required" };
  }
  return { isValid: true };
};

// Helper function to check if new data is richer than existing data
const isRicherData = (newData, existingData) => {
  // Check if new supervisor data is richer
  if (newData.supervisor) {
    // If existing supervisor is null, any new supervisor data is richer
    if (existingData.supervisor.name === null) return true;
    // If new supervisor has a title and existing doesn't, it's richer
    if (
      newData.supervisor.title !== null &&
      existingData.supervisor.title === null
    )
      return true;
  }

  // Check if new topic is more detailed
  if (newData.topic && newData.topic.length > existingData.topic.length)
    return true;

  // Check if new author data is richer
  if (newData.author && newData.author.matricNumber !== "unknown") {
    if (existingData.author.matricNumber === "unknown") return true;
  }

  return false;
};

// Helper function to properly format a name
const formatName = (lastName, firstName, middleName) => {
  // Convert lastName to uppercase
  const formattedLastName = lastName.toUpperCase();

  // Capitalize first letter of first name (handling hyphenated names)
  const formattedFirstName = firstName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-");

  // Format the full name: LASTNAME, Firstname Middlename
  let formattedName = `${formattedLastName}, ${formattedFirstName}`;

  // Add middle name if it exists
  if (middleName && middleName.trim()) {
    // Capitalize first letter of middle name (handling hyphenated names)
    const formattedMiddleName = middleName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("-");

    formattedName += ` ${formattedMiddleName}`;
  }

  return formattedName;
};

// Create project topics in batch (for devs)
const createBulkProjectTopics = async (req, res) => {
  const { topics } = req.body;

  if (!Array.isArray(topics)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Topics must be provided as an array",
    });
  }

  // Validate each topic
  for (const topic of topics) {
    const validation = validateProjectTopic(topic);
    if (!validation.isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: validation.message,
      });
    }

    // Set default supervisor if not provided
    if (!topic.supervisor) {
      topic.supervisor = { name: null, title: null };
    }
  }

  // Find existing topics to identify duplicates
  const existingTopics = await ProjectTopic.find({
    $or: topics.map((topic) => ({
      "author.matricNumber": topic.author.matricNumber,
      year: topic.year,
    })),
  });

  // Create a map of existing topics for quick lookup
  const existingMap = new Map(
    existingTopics.map((topic) => [
      `${topic.author.matricNumber}-${topic.year}`,
      topic,
    ])
  );

  // Separate topics into new, updates, and duplicates
  const newTopics = [];
  const updates = [];
  const duplicateTopics = [];

  topics.forEach((topic) => {
    const key = `${topic.author.matricNumber}-${topic.year}`;
    if (existingMap.has(key)) {
      const existingTopic = existingMap.get(key);
      if (isRicherData(topic, existingTopic)) {
        // Add to updates if new data is richer
        updates.push({
          id: existingTopic._id,
          update: topic,
        });
      } else {
        // Add to duplicates if existing data is richer or equal
        duplicateTopics.push({
          ...topic,
          reason: `Project topic already exists for ${topic.author.name} (${topic.author.matricNumber}) in year ${topic.year} with richer or equal data`,
        });
      }
    } else {
      newTopics.push(topic);
    }
  });

  // Process new topics
  let createdTopics = [];
  if (newTopics.length > 0) {
    createdTopics = await ProjectTopic.insertMany(newTopics);
  }

  // Process updates
  let updatedTopics = [];
  if (updates.length > 0) {
    updatedTopics = await Promise.all(
      updates.map(async ({ id, update }) => {
        const updatedTopic = await ProjectTopic.findByIdAndUpdate(id, update, {
          new: true,
          runValidators: true,
        });
        return updatedTopic;
      })
    );
  }

  res.status(StatusCodes.CREATED).json({
    created: createdTopics,
    updated: updatedTopics,
    duplicates: duplicateTopics,
    message: `Successfully created ${createdTopics.length} topics, updated ${updatedTopics.length} topics with richer data. ${duplicateTopics.length} topics were skipped as they already exist with richer or equal data.`,
  });
};

// Create a single project topic (for students)
const createProjectTopic = async (req, res) => {
  const { year, topic, supervisor } = req.body;
  const { matricNumber } = req.student;

  // Check if student is in 500L
  const student = await Student.findOne({ matricNumber });
  if (!student || student.level !== "500") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Only 500L students can create project topics",
    });
  }

  // Check if student already has a project topic for this year
  const existingTopic = await ProjectTopic.findOne({
    "author.matricNumber": matricNumber,
    year,
  });

  if (existingTopic) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "You already have a project topic for this year",
    });
  }

  // Format student name properly
  const formattedName = formatName(
    student.lastName,
    student.firstName,
    student.middleName
  );

  const projectTopic = await ProjectTopic.create({
    author: {
      name: formattedName,
      matricNumber,
    },
    year,
    topic,
    supervisor: supervisor || { name: null, title: null },
  });

  res.status(StatusCodes.CREATED).json({ projectTopic });
};

// Update a project topic (for students)
const updateProjectTopic = async (req, res) => {
  const { id } = req.params;
  const { topic, supervisor } = req.body;
  const { matricNumber } = req.student;

  const projectTopic = await ProjectTopic.findById(id);
  if (!projectTopic) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: `No project topic with id ${id}`,
    });
  }

  // Check if the student owns this project topic
  if (projectTopic.author.matricNumber !== matricNumber) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Not authorized to update this project topic",
    });
  }

  // Update only allowed fields
  if (topic) projectTopic.topic = topic;
  if (supervisor) projectTopic.supervisor = supervisor;

  await projectTopic.save();
  res.status(StatusCodes.OK).json({ projectTopic });
};

// Delete a project topic (for students)
const deleteProjectTopic = async (req, res) => {
  const { id } = req.params;
  const { matricNumber } = req.student;

  const projectTopic = await ProjectTopic.findById(id);
  if (!projectTopic) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: `No project topic with id ${id}`,
    });
  }

  // Check if the student owns this project topic
  if (projectTopic.author.matricNumber !== matricNumber) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Not authorized to delete this project topic",
    });
  }

  await projectTopic.deleteOne();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Project topic deleted successfully" });
};

// Admin functions (no authentication required)
const adminUpdateProjectTopic = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const projectTopic = await ProjectTopic.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!projectTopic) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: `No project topic with id ${id}`,
    });
  }

  res.status(StatusCodes.OK).json({ projectTopic });
};

const adminDeleteProjectTopic = async (req, res) => {
  const { id } = req.params;

  const projectTopic = await ProjectTopic.findByIdAndDelete(id);
  if (!projectTopic) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: `No project topic with id ${id}`,
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Project topic deleted successfully" });
};

const adminDeleteBulkProjectTopics = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "IDs must be provided as an array",
    });
  }

  const result = await ProjectTopic.deleteMany({ _id: { $in: ids } });
  res.status(StatusCodes.OK).json({
    msg: `Deleted ${result.deletedCount} project topics successfully`,
  });
};

// Read functions
const getAllProjectTopics = async (req, res) => {
  const { year, supervisor, author } = req.query;
  const queryObject = {};

  if (year) queryObject.year = year;
  if (supervisor) queryObject["supervisor.name"] = supervisor;
  if (author) queryObject["author.matricNumber"] = author;

  const projectTopics = await ProjectTopic.find(queryObject)
    .sort("-year")
    .select("-__v");

  res.status(StatusCodes.OK).json({
    count: projectTopics.length,
    projectTopics,
  });
};

const getProjectTopic = async (req, res) => {
  const { id } = req.params;

  const projectTopic = await ProjectTopic.findById(id);
  if (!projectTopic) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: `No project topic with id ${id}`,
    });
  }

  res.status(StatusCodes.OK).json({ projectTopic });
};

const getStudentProjectTopics = async (req, res) => {
  const { matricNumber } = req.student;

  const projectTopics = await ProjectTopic.find({
    "author.matricNumber": matricNumber,
  }).sort("-year");

  res.status(StatusCodes.OK).json({
    count: projectTopics.length,
    projectTopics,
  });
};

module.exports = {
  createBulkProjectTopics,
  createProjectTopic,
  updateProjectTopic,
  deleteProjectTopic,
  adminUpdateProjectTopic,
  adminDeleteProjectTopic,
  adminDeleteBulkProjectTopics,
  getAllProjectTopics,
  getProjectTopic,
  getStudentProjectTopics,
};
