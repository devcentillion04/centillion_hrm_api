const express = require("express");
const employee = require("../../controllers/client/v1/employee");
const router = express.Router();

router.get("/", employee.index);

module.exports = router;
