const express = require("express");
const LeaveController = require("../../controllers/client/v1/leave");
const router = express.Router();
// const auth = require("../../middleware/authorization");

router.post("/create/:id", LeaveController.create);
router.get("/:id", LeaveController.show);
router.get("/", LeaveController.index);
router.put("/update/:id", LeaveController.update);

module.exports = router;
