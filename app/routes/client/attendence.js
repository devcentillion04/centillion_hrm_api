const express = require("express");
const attendance = require("../../controllers/client/v1/attendence");
const router = express.Router();
const auth = require("../../middleware/authorization");

router.get("/:id", auth, attendance.index);
router.post("/create", auth, attendance.create);
router.get("/show/:id", auth, attendance.show);
router.put("/update/:id", auth, attendance.update);
router.get("/", attendance.userAttendence);

module.exports = router;
