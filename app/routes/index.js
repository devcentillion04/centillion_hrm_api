const express = require("express");
const router = express.Router();
const authRoutes = require("./client/auth");
const attendanceRoutes = require("./client/attendence");
const userRoutes = require("./client/user");
const projectRoutes = require("./client/project");
const employeeRoutes = require("./client/employee");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/project", projectRoutes);
router.use("/employee", employeeRoutes);

module.exports = router;
