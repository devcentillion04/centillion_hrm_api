const express = require("express");
const employee = require("../../controllers/client/v1/employee");
const router = express.Router();

router.get("/", employee.index);
router.post("/create", employee.create);
router.get("/:id", employee.show);
router.get("/update/:id", employee.update);

module.exports = router;
