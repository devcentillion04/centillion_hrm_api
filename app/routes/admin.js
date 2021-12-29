const express = require("express");
const router = express.Router();

const salaryRoutes = require("./admin/salary");

router.use("/salary", salaryRoutes);

module.exports = router;
