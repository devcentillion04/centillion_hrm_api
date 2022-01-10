const { LeavesManagement } = require("../../../models/leave");
const { UserSchema } = require("../../../models/user");

class LeaveController {
  async index(req, res) {
    let { page, limit, sortField, sortValue } = req.query;
    let sort = {};
    let whereClause = {};
    if (sortField) {
      sort = {
        [sortField]: sortValue === "ASC" ? 1 : -1,
      };
    } else {
      sort = {
        name: 1,
      };
    }

    let leave = await LeavesManagement.find(whereClause)
      .skip(page > 0 ? +limit * (+page - 1) : 0)
      .limit(+limit || 20)
      .sort(sort)
      .populate({
        path: "userId",
        select: ["firstname", "lastname", "email", "profile"],
      });

    return res
      .status(200)
      .json({ success: true, data: leave.docs ? leave.docs : leave });
  }
  async create(req, res) {
    try {
      let payload = {
        ...req.body,
        leaveFrom: req.body.leaveFrom,
        leaveTo: req.body.leaveTo,
      };
      let { id } = req.params;
      const findUser = await UserSchema.findOne({
        _id: id,
      });
      const leaveData = await new LeavesManagement({
        ...payload,
        userId: findUser._id,
      });
      await leaveData.save();
      return res.status(200).json({ success: true, data: leaveData });
    } catch (error) {
      console.log("Errror");
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async update(req, res) {
    try {
      let payload = {
        ...req.body,
        userId: req.body.userId,
      };
      let leaveUpdate = await LeavesManagement.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        {
          upsert: true,
          new: true,
        }
      );
      return res.status(200).json({ success: true, data: leaveUpdate });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async show(req, res) {
    try {
      let { id } = req.params;
      let user = {};
      if (id) {
        user = { ...req.params._id, userId: id };
      } else {
        user = { ...req.params._id };
      }
      let { page, limit, sortField, sortValue } = req.query;
      let sort = {};
      let whereClause = {};
      if (sortField) {
        sort = {
          [sortField]: sortValue === "ASC" ? 1 : -1,
        };
      } else {
        sort = {
          name: 1,
        };
      }

      let leave = await LeavesManagement.find(user, whereClause)
        .skip(page > 0 ? +limit * (+page - 1) : 0)
        .limit(+limit || 20)
        .sort(sort)
        .populate({
          path: "userId",
          select: ["firstname", "lastname", "email", "profile"],
        });
      return res
        .status(200)
        .json({ success: true, data: leave.docs ? leave.docs : leave });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new LeaveController();
