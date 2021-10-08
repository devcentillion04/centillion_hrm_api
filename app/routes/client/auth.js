const express = require("express");
const AuthController = require("../../controllers/client/v1/auth");
const router = express.Router();
const Validation = require('../../middleware/validation/validation')
router.post("/login",AuthController.login);
router.post("/create",Validation,AuthController.register);

module.exports = router;
