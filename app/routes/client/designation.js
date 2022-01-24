const express = require("express");
const designation = require("../../controllers/client/v1/designation");
const router = express.Router();

router.get("/getAllDesignation", designation.getAllDesignation);
router.post("/addDesignation", designation.addDesignation);
router.put("/updateDesignation/:id", designation.updateDesignation);
router.put("/delete/:id", designation.delete);

module.exports = router;
