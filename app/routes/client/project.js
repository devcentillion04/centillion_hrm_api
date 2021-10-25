const express = require("express");
const project = require("../../controllers/client/v1/project");
const router = express.Router();

router.get("/",project.index);
router.post("/create",project.create)
router.get("/:id",project.show);
router.put("/update/:id",project.update);
router.put("/delete/:id",project.delete);

module.exports = router