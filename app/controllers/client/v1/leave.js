const { LeavesManagement } = require("../../../models/leave");
const { UserSchema } = require("../../../models/user");
const holidaySchema = require("../../../models/publicHoliday");
const moment = require("moment");

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
    var populateData = {
      path: "userId",
      select: ["email", "firstname", "lastname", "profile"],
    };
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: { [sort_key]: sort_direction },
      populate: populateData,
    };

    let leave =
      req.query.page || req.query.limit
        ? await LeavesManagement.paginate(criteria, options)
        : await LeavesManagement.find(criteria).sort({
            [sort_key]: sort_direction,
          });

    return res
      .status(200)
      .json({ success: true, data: leave.docs ? leave.docs : leave });
  }

  /**
   * For Apply leave
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async applyLeave(req, res) {
    try {
      let data = {
        ...req.body,
        leaveFrom: req.body.leaveFrom,
        leaveTo: req.body.leaveTo,
        status: "pending",
      };
      //find user data
      let userData = await UserSchema.findOne(
        {
          _id: req.params.id,
        },
        {
          totalPaidLeave: 1,
          totalUnpaidLeave: 1,
        }
      );
      let start = moment(data.leaveFrom, "YYYY-MM-DD");
      let end = moment(data.leaveTo, "YYYY-MM-DD");
      let leaveFlag = moment().isSameOrBefore(start, "days");
      //check valid leave apply or not
      if (leaveFlag) {
        let leaveCount;
        if (
          data.leaveType == "First-Half-Leave" ||
          data.leaveType == "Second-Half-Leave"
        ) {
          leaveCount = 0.5;
        }
        if (data.leaveType == "FullLeave") {
          leaveCount = 1;
        }
        let leaveDaysCount = workingDaysCount(start, end);
        // let publicHolidayList = await holidaySchema.findOne({
        //   isDeleted: false,
        //   year: "2022",
        // });
        let publicHolidayList = {
          holidayList: [
            {
              holidayName: "Makar Sankranti",
              holidayDate: "14/01/2022",
            },
            {
              holidayName: "Republic Day",
              holidayDate: "26/01/2022",
            },
            {
              holidayName: "Holi",
              holidayDate: "18/03/2022",
            },
            {
              holidayName: "Ramzan Eid",
              holidayDate: "03/05/2022",
            },
            {
              holidayName: "Rakshbandhan",
              holidayDate: "11/08/2022",
            },
            {
              holidayName: "Independence Day",
              holidayDate: "15/08/2022",
            },
            {
              holidayName: "Janmashtami",
              holidayDate: "18/08/2022",
            },
            {
              holidayName: "Diwali",
              holidayDate: "24/10/2022",
            },
            {
              holidayName: "New Year",
              holidayDate: "25/10/2022",
            },
            {
              holidayName: "Bhai Dooj",
              holidayDate: "26/10/2022",
            },
            {
              holidayName: "Christmas",
              holidayDate: "25/12/2022",
            },
          ],
          year: "2022",
          isDeleted: false,
        };
        let publicHolidayCount = 0;
        publicHolidayList.holidayList.forEach((element) => {
          if (!(element.day == "Sunday" || element.day == "Satuerday")) {
            let date = moment(element.holidayDate, "DD/MM/YYYY").format(
              "YYYY-MM-DD"
            );
            if (moment(date).isBetween(start, end)) {
              publicHolidayCount++;
            }
          }
        });
        leaveDaysCount = leaveDaysCount - publicHolidayCount;
        data.totalDay = leaveDaysCount * leaveCount;
        //update isPaid flag accroding to leave type
        if (
          (userData.totalPaidLeave >= data.totalDay &&
            data.type == "PaidLeave") ||
          data.type == "UnpaidLeave"
        ) {
          let { id } = req.params;
          if (data.type == "PaidLeave") {
            data.isPaid = true;
          }
          if (data.type == "UnpaidLeave") {
            data.isPaid = false;
          }

          let leaveData = await new LeavesManagement({
            ...data,
            userId: id,
          });

          await leaveData.save(); //create leave document
          return res.status(200).json({ success: true, data: leaveData });
        } else {
          return res
            .status(500)
            .json({ success: false, data: "Not Available for Paid Leave" });
        }
      } else {
        return res
          .status(500)
          .json({ success: false, data: "Please Select Valid Date" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * For Update leave Data
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async update(req, res) {
    try {
      let data = {
        ...req.body,
        leaveFrom: req.body.leaveFrom,
        leaveTo: req.body.leaveTo,
      };
      let start = moment(data.leaveFrom, "YYYY-MM-DD");
      let end = moment(data.leaveTo, "YYYY-MM-DD");
      let leaveFlag = moment().isSameOrBefore(start, "days");
      //check valid leave apply or not
      if (leaveFlag) {
        let leaveCount;
        if (
          data.leaveType == "First-Half-Leave" ||
          data.leaveType == "Second-Half-Leave"
        ) {
          leaveCount = 0.5;
        }
        if (data.leaveType == "FullLeave") {
          leaveCount = 1;
        }
        let leaveDaysCount = workingDaysCount(start, end);
        let currentYear = moment().format("YYYY");
        // let publicHolidayList = await holidaySchema.findOne({
        //   isDeleted: false,
        //   year: currentYear,
        // });
        let publicHolidayList = {
          holidayList: [
            {
              holidayName: "Makar Sankranti",
              holidayDate: "14/01/2022",
            },
            {
              holidayName: "Republic Day",
              holidayDate: "26/01/2022",
            },
            {
              holidayName: "Holi",
              holidayDate: "18/03/2022",
            },
            {
              holidayName: "Ramzan Eid",
              holidayDate: "03/05/2022",
            },
            {
              holidayName: "Rakshbandhan",
              holidayDate: "11/08/2022",
            },
            {
              holidayName: "Independence Day",
              holidayDate: "15/08/2022",
            },
            {
              holidayName: "Janmashtami",
              holidayDate: "18/08/2022",
            },
            {
              holidayName: "Diwali",
              holidayDate: "24/10/2022",
            },
            {
              holidayName: "New Year",
              holidayDate: "25/10/2022",
            },
            {
              holidayName: "Bhai Dooj",
              holidayDate: "26/10/2022",
            },
            {
              holidayName: "Christmas",
              holidayDate: "25/12/2022",
            },
          ],
          year: "2022",
          isDeleted: false,
        };
        let publicHolidayCount = 0;
        publicHolidayList.holidayList.forEach((element) => {
          if (!(element.day == "Sunday" || element.day == "Satuerday")) {
            let date = moment(element.holidayDate, "DD/MM/YYYY").format(
              "YYYY-MM-DD"
            );
            if (moment(date).isBetween(start, end)) {
              publicHolidayCount++;
            }
          }
        });
        leaveDaysCount = leaveDaysCount - publicHolidayCount;
        data.totalDay = leaveDaysCount * leaveCount;

        if (data.type == "PaidLeave") {
          data.isPaid = true;
        }
        if (data.type == "UnpaidLeave") {
          data.isPaid = false;
        }

        await LeavesManagement.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          data
        );
        return res
          .status(200)
          .json({ success: true, data: "Successfully leave Data Updated" });
      } else {
        return res
          .status(500)
          .json({ success: false, data: "Please Select Valid Date" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * FOr List leave data by UserId
   * @param {*} req
   * @param {*} res
   * @returns
   */
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
      if (req.body.isApproved) {
        //get current leave data
        let leaveData = await LeavesManagement.findOne(
          {
            _id: req.params.id,
            isDeleted: false,
          },
          {
            totalDay: 1,
            isPaid: 1,
            isApproved: 1,
            userId: 1,
          }
        );
        if (leaveData.isApproved) {
          //get user data
          let userData = await UserSchema.findOne(
            {
              _id: leaveData.userId,
            },
            {
              totalUnpaidLeave: 1,
              totalPaidLeave: 1,
            }
          );

          //chek leave type & update count
          if (leaveData.isPaid == true) {
            userData.totalPaidLeave =
              userData.totalPaidLeave + leaveData.totalDay;
          } else {
            userData.totalUnpaidLeave =
              userData.totalUnpaidLeave + leaveData.totalDay;
          }
          //update user data
          await UserSchema.updateOne(
            {
              _id: leaveData.userId,
            },
            {
              totalUnpaidLeave: userData.totalUnpaidLeave,
              totalPaidLeave: userData.totalPaidLeave,
            }
          );
        }
      }
      await LeavesManagement.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          isDeleted: true,
          status: "cancel",
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
      let leaveData = await LeavesManagement.findOne({
        _id: req.params.id,
      }).populate({
        path: "userId",
        select: ["totalPaidLeave", "totalUnpaidLeave", "_id"],
      });
      await LeavesManagement.updateOne(
        {
          _id: req.params.id,
        },
        {
          approvedBy: req.body.approvedBy,
          isApproved: true,
          status: "approved",
          approveDate: moment(),
        }
      );
      if (leaveData.isPaid == true) {
        leaveData.userId.totalPaidLeave =
          leaveData.userId.totalPaidLeave - leaveData.totalDay;
      }
      if (leaveData.isPaid == false) {
        leaveData.userId.totalUnpaidLeave =
          leaveData.userId.totalUnpaidLeave - leaveData.totalDay;
      }
      await UserSchema.updateOne(
        {
          _id: leaveData.userId._id,
        },
        {
          totalPaidLeave: leaveData.userId.totalPaidLeave,
          totalUnpaidLeave: leaveData.userId.totalUnpaidLeave,
        }
      );

      return res.status(200).json({
        success: true,
        data: {},
        message: "Successfully Leave Approved",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * For Reject leave api
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async rejectLeave(req, res) {
    try {
      await LeavesManagement.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          rejectedBy: req.body.rejectedBy,
          isApproved: false,
          status: "rejected",
          rejectDate: moment(),
        }
      );
      return res.status(200).json({
        success: true,
        data: {},
        message: "Successfully Leave Rejected",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * For Get Current leave Data
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getLeaveData(req, res) {
    try {
      let leaveData = await LeavesManagement.findOne({
        _id: req.params.id,
      });
      return res.status(200).json({
        success: true,
        data: leaveData,
        message: "",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * For Get Current leave Data
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async publicHolidayList(req, res) {
    try {
      let publicHolidayList = {
        holidayList: [
          {
            holidayName: "Makar Sankranti",
            holidayDate: "14/01/2022",
          },
          {
            holidayName: "Republic Day",
            holidayDate: "26/01/2022",
          },
          {
            holidayName: "Holi",
            holidayDate: "18/03/2022",
          },
          {
            holidayName: "Ramzan Eid",
            holidayDate: "03/05/2022",
          },
          {
            holidayName: "Rakshbandhan",
            holidayDate: "11/08/2022",
          },
          {
            holidayName: "Independence Day",
            holidayDate: "15/08/2022",
          },
          {
            holidayName: "Janmashtami",
            holidayDate: "18/08/2022",
          },
          {
            holidayName: "Diwali",
            holidayDate: "24/10/2022",
          },
          {
            holidayName: "New Year",
            holidayDate: "25/10/2022",
          },
          {
            holidayName: "Bhai Dooj",
            holidayDate: "26/10/2022",
          },
          {
            holidayName: "Christmas",
            holidayDate: "25/12/2022",
          },
        ],
        year: "2022",
        isDeleted: false,
      };
      return res.status(200).json({
        success: true,
        data: publicHolidayList,
        message: "",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

const workingDaysCount = (start, end) => {
  var first = start.clone().endOf("week"); // end of first week
  var last = end.clone().startOf("week"); // start of last week
  var days = (last.diff(first, "days") * 5) / 7; // this will always multiply of 7
  var wfirst = first.day() - start.day(); // check first week
  if (start.day() == 0) --wfirst; // -1 if start with sunday
  var wlast = end.day() - last.day(); // check last week
  if (end.day() == 6) --wlast; // -1 if end with saturday
  return wfirst + Math.floor(days) + wlast; // get the total
};

module.exports = new LeaveController();
