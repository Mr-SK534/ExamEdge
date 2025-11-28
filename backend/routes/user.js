const express = require("express");
const router = express.Router();

// FIXED import
const protect = require("../middleware/auth");

// Import controller
const { updateProfile } = require("../controllers/userController");

// Protected route
router.put("/update-profile", protect, updateProfile);

module.exports = router;
