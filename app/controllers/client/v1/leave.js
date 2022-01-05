const { LeavesManagement } = require("../../../models/leave");
const { userSchema } = require("../../../models/user");

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
  async applyLeave(req, res) {
    try {
      let payload = {
        ...req.body,
        leaveFrom: req.body.leaveFrom,
        leaveTo: req.body.leaveTo,
      };
      let { id } = req.params;
      const findUser = await userSchema.findOne({
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
      let { id } = req.params;
      let user = {};
      if (id) {
        user = { ...req.params._id, userId: id };
      } else {
        user = { ...req.params._id };
      }
      let data = await LeavesManagement.find(user).populate({
        path: "userId",
        select: ["email", "firstname", "lastname", "profile"],
      });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * For Cancel Leave
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async cancelLeave(req, res) {
    try {
      await LeavesManagement.updateOne(
        {
          _id: req.params.id,
        },
        {
          isDeleted: true,
        }
      );
      return res.status(200).json({
        success: true,
        data: {},
        message: "Successfully Leave Cancel",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  /**
   * For Approve leave api
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async approveLeave(req, res) {
    try {
      // let leaveData = await LeavesManagement.findOne(
      //   {
      //     _id: req.params.id,
      //   },
      //   {
      //     totalDay: 1,
      //     userId: 1,
      //   }
      // );
      await LeavesManagement.updateOne(
        {
          _id: req.params.id,
        },
        {
          approvedBy: req.body.approvedBy,
          isApproved: true,
          status: "approved",
        }
      );
      // if (leaveData.userId) {
      //   let userData = await userSchema.findOne(
      //     {
      //       _id: leaveData.userId,
      //     },
      //     {
      //       totalPaidLeave: 1,
      //     }
      //   );
      //   let totalPaidLeaveCount = userData.totalPaidLeave - leaveData.totalDay;
      //   await userSchema.updateOne(
      //     {
      //       _id: leaveData.userId,
      //     },
      //     {
      //       totalPaidLeave: totalPaidLeaveCount,
      //     }
      //   );
      // }

      return res.status(200).json({
        success: true,
        data: {},
        message: "Successfully Leave Approved",
      });
    } catch {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * For Approve leave api
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async rejectLeave(req, res) {
    try {
      await LeavesManagement.updateOne(
        {
          _id: req.params.id,
        },
        {
          rejectedBy: req.body.rejectedBy,
          isApproved: false,
          status: "rejected",
        }
      );
      return res.status(200).json({
        success: true,
        data: {},
        message: "Successfully Leave Rejected",
      });
    } catch {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new LeaveController();
