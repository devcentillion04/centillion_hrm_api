const express = require("express");
const router = express.Router();
const User = require("../../controllers/client/v1/user");
const auth = require("../../middleware/authorization");
const { validate, user_schema } = require("../../middleware/validation");

router.get("/", auth, User.index);
router.get("/:id", auth, User.show);
router.put("/delete/:id", User.delete);
router.put("/update/:id", [validate(user_schema.user)], auth, User.update);

module.exports = router;
