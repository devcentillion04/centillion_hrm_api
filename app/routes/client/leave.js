const express = require("express");
const LeaveController = require("../../controllers/client/v1/leave");
const router = express.Router();
const { validate, leaveSchema } = require("../../middleware/validation");
const auth = require("../../middleware/authorization");

router.post("/apply-leave/:id", [auth], LeaveController.applyLeave);
router.get("/:id", LeaveController.show);
router.get("/", auth, LeaveController.index);
router.put("/update/:id", LeaveController.update); //update leave data
router.put("/cancelLeave/:id", LeaveController.cancelLeave); //cancel leave
router.put("/approveLeave/:id", LeaveController.approveLeave); //approve leave
router.put("/rejectLeave/:id", LeaveController.rejectLeave); //reject leave
router.get("/getLeaveData/:id", LeaveController.getLeaveData); //get leave data
router.post("/publicHolidayList", LeaveController.publicHolidayList); //get all public holiday list
router.post("/getUpcomingLeaves/:userId", LeaveController.getUpcomingLeaves);
module.exports = router;
