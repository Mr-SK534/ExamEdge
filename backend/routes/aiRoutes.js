const express = require("express");
const router = express.Router();
const { generateMonthlyPlan } = require("../controllers/aiController");

router.post("/generate-monthly-plan", generateMonthlyPlan);

module.exports = router;
