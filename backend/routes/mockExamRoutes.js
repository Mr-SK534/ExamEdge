const express = require("express");
const router = express.Router();
const controller = require("../controllers/mockExamController");

router.get("/list", controller.listMocks);
router.get("/load/:exam/:id", controller.loadMock);

module.exports = router;
