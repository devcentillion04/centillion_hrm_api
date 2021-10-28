const express = require("express");
const attendance = require("../../controllers/client/v1/attendence");
const router = express.Router();
const auth = require("../../middleware/authorization");

router.get("/", auth, attendance.index);
router.post("/create", auth, attendance.create);
router.get("/:id", auth, attendance.show);

module.exports = router;
