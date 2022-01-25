const express = require("express");
const leaveAttendenceReqController = require("../../controllers/client/v1/leaveattendencereq");
const router = express.Router();
const { validate } = require("../../middleware/validation");
const auth = require("../../middleware/authorization");

router.post("/create", auth, leaveAttendenceReqController.create);
router.put("/approve/:id", auth, leaveAttendenceReqController.approve);
router.get("/getallrequestbyid", auth, leaveAttendenceReqController.getAllRequestById);
router.put("/delete/:id", leaveAttendenceReqController.delete);
module.exports = router;
