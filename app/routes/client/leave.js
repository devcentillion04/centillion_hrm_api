const express = require("express");
const LeaveController = require("../../controllers/client/v1/leave");
const router = express.Router();
const auth = require("../../middleware/authorization");

router.post("/applyleave/:id", [auth], LeaveController.applyLeave);
router.get("/:id", LeaveController.show);
router.get("/", auth, LeaveController.index);
router.put("/update/:id", LeaveController.update); //update leave data
router.put("/cancelleave/:id", LeaveController.cancelLeave); //cancel leave
router.put("/approveleave/:id", LeaveController.approveLeave); //approve leave
router.put("/rejectleave/:id", LeaveController.rejectLeave); //reject leave
router.get("/getleavedata/:id", LeaveController.getLeaveData); //get leave data
router.get("/publicholidaylist", LeaveController.publicHolidayList); //get all public holiday list
router.post("/getupcomingleaves/:userId", LeaveController.getUpcomingLeaves);
module.exports = router;
