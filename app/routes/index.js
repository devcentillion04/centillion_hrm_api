const express = require("express");
const router = express.Router();
const authRoutes = require("./client/auth");
const attendanceRoutes = require("./client/attendence");
const userRoutes = require("./client/user");
const projectRoutes = require("./client/project");
const employeeRoutes = require("./client/employee");
const salaryRoutes = require("./client/salary");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/project", projectRoutes);
router.use("/employee", employeeRoutes);
router.use("/salary", salaryRoutes);

module.exports = router;
