const express = require("express");
const router = express.Router();

const salaryRoutes = require("./admin/salary");
const salarySlip = require("./admin/salarySlip");

router.use("/salary", salaryRoutes);
router.use("/salarySlip", salarySlip);

module.exports = router;
