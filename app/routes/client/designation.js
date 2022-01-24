const express = require("express");
const designation = require("../../controllers/client/v1/designation");
const router = express.Router();

router.get("/getalldesignation", designation.getAllDesignation);
router.post("/adddesignation", designation.addDesignation);
router.put("/updatedesignation/:id", designation.updateDesignation);
router.put("/delete/:id", designation.delete);

module.exports = router;
