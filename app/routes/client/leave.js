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
router.post("/update/:id", LeaveController.update); //update leave data
router.post("/cancelLeave/:id", LeaveController.cancelLeave); //cancel leave
router.post("/approveLeave/:id", LeaveController.approveLeave); //approve leave
router.post("/rejectLeave/:id", LeaveController.rejectLeave); //reject leave
router.get("/getLeaveData/:id", LeaveController.getLeaveData); //get leave data
router.post("/publicHolidayList", LeaveController.publicHolidayList); //get all public holiday list
router.post("/getUpcomingLeaves/:userId", LeaveController.getUpcomingLeaves);
router.post(
  "/getTotalPendigLeaves/:userId",
  LeaveController.getTotalPendigLeaves
);
module.exports = router;
