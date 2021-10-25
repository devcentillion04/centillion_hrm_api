const employeeSchema = require("../../../models/employee");

class employeeController {
  async index(req, res) {
    try {
      let criteria = {
        userId: req.params._id,
      };
      let employee = await employeeSchema.find(criteria);
      console.log(employee);
      return res.status(200).json({ success: true, data: employee });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async create(req, res) {}
}
module.exports = new employeeController();
