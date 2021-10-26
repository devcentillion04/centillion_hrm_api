const express = require("express");
const employee = require("../../controllers/client/v1/employee");
const router = express.Router();

router.get("/", employee.index);
router.post("/create", employee.create);
router.get("/:id", employee.show);
router.put("/update/:id", employee.update);
router.put("/delete/:id", employee.delete);

module.exports = router;
