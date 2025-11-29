const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const { updateProfile, getUserStats } = require("../controllers/userController");

// Existing route
router.put("/update-profile", protect, updateProfile);

// New route — for live stats
router.get("/stats", protect, getUserStats);

module.exports = router;