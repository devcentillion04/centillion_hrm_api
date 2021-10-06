const express = require("express");
const attendance = require("../../controllers/client/v1/attendence");
const router = express.Router();

router.get("/", attendance.index);
router.post("/create", attendance.create);
router.get("/:id", attendance.show);

module.exports = router;
