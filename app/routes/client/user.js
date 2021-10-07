const express = require("express");
const router = express.Router();
const User  = require('../../controllers/client/v1/user')

router.put("/update",User.update);

module.exports = router;
