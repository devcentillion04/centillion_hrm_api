const express = require("express");
const role = require("../../controllers/admin/v1/role");
const router = express.Router();

router.post("/create", role.createRole);
router.get("/", role.getRole);
router.put("/update/:id", role.updateRole);
router.put("/delete/:id", role.deleteRole);

module.exports = router;
