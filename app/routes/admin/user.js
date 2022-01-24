const express = require("express");
const router = express.Router();
const User = require("../../controllers/admin/v1/user");
const auth = require("../../middleware/authorization");

router.put("/assignTeamLeader/:id", auth, User.assignTeamLeader);

module.exports = router;
