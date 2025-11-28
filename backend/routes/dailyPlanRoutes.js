const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const {
  generateDailyPlan,
  getTodayPlan,
  markTaskDone
} = require("../controllers/dailyPlanController");

router.use(protect);

router.post("/generate", generateDailyPlan);
router.get("/today", getTodayPlan);
router.put("/done/:taskId", markTaskDone);

module.exports = router;
