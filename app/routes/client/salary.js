const express = require("express");
const salary = require("../../controllers/client/v1/salary");
const router = express.Router();

router.get("/", salary.index);
router.post("/create", salary.create);
router.get("/:id", salary.show);
router.put("/delete/:id", salary.delete);

module.exports = router;
