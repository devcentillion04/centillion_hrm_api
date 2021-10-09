const express = require("express");
const router = express.Router();
const User = require("../../controllers/client/v1/user");

router.get("/", User.index);
router.put("/update/:id", User.update);

module.exports = router;
