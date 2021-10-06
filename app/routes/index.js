const express = require("express");
const router = express.Router();
const authRoutes = require("./client/auth");
const attendanceRoutes = require("./client/attendence");
const userRoutes = require("./client/user");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/attendance", attendanceRoutes);

module.exports = router;
