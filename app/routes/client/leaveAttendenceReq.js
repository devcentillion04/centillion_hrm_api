const express = require("express");
const leaveAttendenceReqController = require("../../controllers/client/v1/leaveattendencereq");
const router = express.Router();
const { validate } = require("../../middleware/validation");
const auth = require("../../middleware/authorization");

router.get("/:id", leaveAttendenceReqController.index);
router.post("/create", auth, leaveAttendenceReqController.create);
router.put("/update/:id", leaveAttendenceReqController.update);
router.put("/approve/:id", auth, leaveAttendenceReqController.approve);
router.get("/test/getallrequestbyid", auth, leaveAttendenceReqController.getAllRequestById);
router.put("/delete/:id", leaveAttendenceReqController.delete);
router.put("/rejectRequest/:id", leaveAttendenceReqController.rejectRequest);
module.exports = router;
