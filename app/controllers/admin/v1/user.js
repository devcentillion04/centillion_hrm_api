const { UserSchema } = require("../../../models/user");

class UserController {
    async assignTeamLeader(req, res) {
        try {
            let user = await UserSchema.updateOne({
                _id: req.params.id
            }, {
                teamLeader: req.body.userId
            });
            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new UserController();
