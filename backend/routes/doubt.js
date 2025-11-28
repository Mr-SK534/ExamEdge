const express = require("express");
const router = express.Router();
const { solveDoubt } = require("../controllers/doubtController");
const protect = require("../middleware/auth");

// All doubt-solving routes are protected
router.use(protect);

// POST /api/doubt/solve
router.post("/solve", solveDoubt);

module.exports = router;
