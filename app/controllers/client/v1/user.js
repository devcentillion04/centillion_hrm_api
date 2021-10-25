const { UserSchema } = require("../../../models/user");

class UserController {
  async index(req, res) {
    let user = await UserSchema.find(req.params.id);
    return res.status(200).json({ success: true, data: user });
  }
  catch(error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  async update(req, res) {
    try {
      let payload = {
        ...req.body,
      };
      let user = await UserSchema.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async show(req, res) {
    try {
      let user = await UserSchema.findById(req.params.id);
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserController();
