const express = require("express");
const router = express.Router();
const authenticateStudent = require("../middleware/authentication");

const {
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
} = require("../controllers/projectTopics");

// Student routes (require authentication)
router.post("/", authenticateStudent, createProjectTopic);
router.patch("/:id", authenticateStudent, updateProjectTopic);
router.delete("/:id", authenticateStudent, deleteProjectTopic);
router.get("/my-topics", authenticateStudent, getStudentProjectTopics);

// Admin routes (no authentication required)
router.post("/bulk", createBulkProjectTopics);
router.patch("/admin/:id", adminUpdateProjectTopic);
router.delete("/admin/:id", adminDeleteProjectTopic);
router.delete("/admin/bulk", adminDeleteBulkProjectTopics);

// Public routes
router.get("/", getAllProjectTopics);
router.get("/:id", getProjectTopic);

module.exports = router;
