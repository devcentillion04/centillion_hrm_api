const express = require("express");
const AuthController = require("../../controllers/client/v1/auth");
const router = express.Router();

router.post("/login", AuthController.login);
router.post("/create", AuthController.register);

module.exports = router;
