const express = require("express");
const LeaveController = require("../../controllers/client/v1/leave");
const router = express.Router();
const { validate, leaveSchema } = require("../../middleware/validation");
// const auth = require("../../middleware/authorization");

router.post(
  "/applyLeave/:id",
  [validate(leaveSchema.leave)],
  LeaveController.applyLeave
);
router.get("/:id", LeaveController.show);
router.get("/", LeaveController.index);
router.put("/update/:id", LeaveController.update);
router.get("/cancelLeave/:id", LeaveController.cancelLeave);
router.put("/approveLeave/:id", LeaveController.approveLeave);
router.put("/rejectLeave/:id", LeaveController.rejectLeave);
router.get("/getLeaveData/:id", LeaveController.getLeaveData);
module.exports = router;
