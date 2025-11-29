const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { saveMockHistory, getMockHistory } = require("../controllers/mockHistoryController");

// Save mock attempt
router.post("/save", protect, saveMockHistory);

// Get history for user
router.get("/history", protect, getMockHistory);

module.exports = router;
