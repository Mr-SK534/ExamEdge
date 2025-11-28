const express = require("express");
const router = express.Router();

const {
  createMockTest,
  getAllMocks,
  getMockById,
  submitMockTest,
  getUserMockHistory,
} = require("../controllers/mockTestController");

// Correct middleware import
const protect = require("../middleware/auth");

// Protect all routes
router.use(protect);

// ROUTES
router.post("/create", createMockTest);           // Admin creates mock
router.get("/", getAllMocks);                     // Get all available mocks
router.get("/history", getUserMockHistory);       // User's past attempts
router.get("/:id", getMockById);                  // Get single mock with questions
router.post("/:id/submit", submitMockTest);       // Submit answers → get result

// Export once ONLY
module.exports = router;
