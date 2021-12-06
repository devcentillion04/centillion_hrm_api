const SalarySchema = require("../../../models/salary");

class SalaryController {
  async index(req, res) {
    try {
      let criteria = {
        isDeleted: false,
      };
      let salary = await SalarySchema.find(req.params._id, criteria);
      return res.status(200).json({ success: true, data: salary });
    } catch (error) {
      return res.status(500).json({ succcess: false, message: error.message });
    }
  }
  async create(req, res) {
    try {
      let payload = {
        ...req.body,
        userId: req.body.userId,
      };
      let a = {
        attendanceId: req.body.attendanceId,
      };

      let salary = new SalarySchema(payload);
      await salary.save();
      return res.status(200).json({ success: true, data: salary });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async show(req, res) {
    try {
      let salary = await SalarySchema.findById(req.params.id)
        .populate("userId", "email salary")
        .populate("attendanceId");
      // let total =
      //   salary.attendanceId.totalHours - salary.attendanceId.workingHours;
      // let totalSalary = salary.salary - total * 30;
      return res.status(200).json({ success: true, data: salary });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async delete(req, res) {
    try {
      await SalarySchema.findOneAndUpdate(
        { _id: req.params.id },
        { isDeleted: true }
      );
      return res.status(200).json({ success: true, data: [] });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
module.exports = new SalaryController();
