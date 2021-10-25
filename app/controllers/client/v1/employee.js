const employeeSchema = require("../../../models/employee");
const { UserSchema } = require("../../../models/user");

class employeeController {
  async index(req, res) {
    try {
      let employee = await employeeSchema.find(req.params.id);
      return res.status(200).json({ success: true, data: employee });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async create(req, res) {
    try {
      let payload = {
        ...req.body,
        userId: req.body.userId,
      };
      console.log(payload);
      let employee = new employeeSchema(payload);
      employee.save();
      return res.status(200).json({ success: true, data: employee });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async show(req, res) {
    try {
      let criteria = {
        userId: req.params.userId,
      };
      let UserData = await UserSchema.findById();
      let employee = await employeeSchema
        .findById(req.params.id)
        .populate({ path: "userId" });
      return res.status(200).json({ success: true, data: employee });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async update(req, res) {
    try {
      let employee = await projectSchema.findById(req.params.id);
      let payload = {
        ...req.body,
      };
      let employeeUpdate = await employeeSchema.findByIdAndUpdate(
        employee,
        payload,
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, data: employeeUpdate });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
module.exports = new employeeController();
