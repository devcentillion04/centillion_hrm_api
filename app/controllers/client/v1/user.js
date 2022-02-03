const { UserSchema } = require("../../../models/user");
const moment = require("moment");
const { hashSync, genSaltSync, compare } = require("bcrypt");
class UserController {
  async index(req, res) {
    let sort_key = req.query.sort_key || "name";
    let sort_direction = req.query.sort_direction
      ? req.query.sort_direction === "asc"
        ? 1
        : -1
      : 1;

    let criteria = { isDeleted: false };

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
        ? await UserSchema.paginate(criteria, options)
        : await UserSchema.find(criteria).sort({ [sort_key]: sort_direction });

    // let user = await UserSchema.find(req.params.id);
    return res.status(200).json({ success: true, data: user });
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

      return res
        .status(200)
        .json({
          success: true,
          data: user,
          message: "User Update Successfully",
        });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async show(req, res) {
    try {
      let user = await UserSchema.findById(req.params.id).populate({
        path: "role",
        select: ["name"]
      });
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
      return res
        .status(200)
        .json({
          success: true,
          data: [],
          message: "User Deleted successfully",
        });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updatePasseword(req, res) {
    try {
      let user = req.currentUser;
      const match = await compare(req.body.old_password, user.password);
      if (match) {
        let payload = {
          password: hashSync(req.body.password, genSaltSync(10)),
        };
        await UserSchema.findOneAndUpdate({ _id: user.id }, payload, {
          upsert: true,
          new: false,
        });
        return res
          .status(200)
          .json({
            success: true,
            data: user,
            message: "Password Update Successfully",
          });
      } else {
        throw new Error("Old Password wrong!!!");
      }
    } catch (error) {
      return res.status(200).json({ success: false, message: error.message });
    }
  }
  /**
   * Get current user team data 
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async getTeamDataById(req, res) {
    try {
      let teamData = await UserSchema.find({
        teamLeader: req.currentUser._id,
        isDeleted: false,
      }, {
        firstname: 1,
        lastname: 1,
        email: 1,
        mobileno: 1,
        isDeleted: 1,
        profile: 1,
        employeeType: 1,
      });

      let TeamLeader = await UserSchema.findOne({
        _id: req.currentUser.teamLeader,
        isDeleted: false,
      }, {
        firstname: 1,
        lastname: 1,
        email: 1,
        mobileno: 1,
        isDeleted: 1,
        profile: 1,
        employeeType: 1,
      });

      let peers = await UserSchema.find({
        teamLeader: req.currentUser.teamLeader
      }, {
        firstname: 1,
        lastname: 1,
        email: 1,
        mobileno: 1,
        isDeleted: 1,
        profile: 1,
        employeeType: 1,
      });

      let data = {
        teamData: teamData,
        TeamLeader: TeamLeader,
        peers: peers
      }

      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

}

module.exports = new UserController();
