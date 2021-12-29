const { LeavesManagement } = require("../../../models/leave");
const { UserSchema } = require("../../../models/user");

class LeaveController {
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

    let leave =
      req.query.page || req.query.limit
        ? await LeavesManagement.paginate(criteria, options)
        : await LeavesManagement.find(criteria).sort({
            [sort_key]: sort_direction,
          });

    return res.status(200).json({ success: true, data: leave });
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
      console.log(findUser._id);
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
      let leave = await LeavesManagement.findById(req.params.id);
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
      const { id } = req.params;
      let data = await LeavesManagement.findById(id).populate({
        path: "userId",
        select: "email",
      });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new LeaveController();
