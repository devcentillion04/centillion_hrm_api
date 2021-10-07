const { UserSchema } = require("../../../models/user");

class UserController {
    async update(res, req) {
        try {
          let payload = {
            ...req.body,
          };
          let attendence = await UserSchema.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { upsert: true, new: true }
          );
          return res.status(200).json({ success: true, data: attendence });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message });
        }
      }
}

module.exports = new UserController();
