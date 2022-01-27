const express = require("express");
const leaveAttendenceReqController = require("../../controllers/client/v1/leaveAttendenceReq");
const router = express.Router();
const { validate } = require("../../middleware/validation");
const auth = require("../../middleware/authorization");


router.get("/:id", auth, leaveAttendenceReqController.index);
router.put("/create", leaveAttendenceReqController.create);
router.post("/approve/:id", auth, leaveAttendenceReqController.approve);
router.put("/getallrequestbyid/:userId", auth, leaveAttendenceReqController.getAllRequestById);
router.put("/delete/:id", auth, leaveAttendenceReqController.delete);
module.exports = router;
