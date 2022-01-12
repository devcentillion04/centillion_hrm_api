const { UserSchema } = require("../../../models/user");
const moment = require("moment");
class UserController {
  async index(req, res) {
    let sort_key = req.query.sort_key || "name";
    let sort_direction = req.query.sort_direction
      ? req.query.sort_direction === "asc"
        ? 1
        : -1
      : 1;

    let criteria = {};

    if (req.query.type) {
      Object.assign(criteria, { type: req.query.type });
    }

    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: { [sort_key]: sort_direction },
      
    };

    let user =
      req.query.page || req.query.limit
        ? await UserSchema.paginate({criteria, options,isDeleted:false})
        : await UserSchema.find({criteria,isDeleted:false}).sort({ [sort_key]: sort_direction });

    // let user = await UserSchema.find(req.params.id);
    return res.status(200).json({ success: true, data: user.docs ? user.docs : user });
  }
  catch(error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  async update(req, res) {
    try {
      let payload = {
        ...req.body,
        birthdate: req.body.birthdate,
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
  async delete(req, res) {
    try {
      await UserSchema.findOneAndUpdate(
        { _id: req.params.id },
        { isDeleted: true },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, data: [], message:'Delete Employee Successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserController();
