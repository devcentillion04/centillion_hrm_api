const { LeavesManagement } = require("../../../models/leave");
const { UserSchema } = require("../../../models/user");
const holidaySchema = require("../../../models/publicHoliday");
const moment = require("moment-timezone");
const timezone = "+5:30";

class LeaveController {
  async index(req, res) {
    let { page, limit, sortField, sortValue, sort_key, sort_direction } = req.query;
    let sort = {};
    let criteria = { isDeleted: false };
    if (sortField) {
      sort = {
        [sortField]: sortValue === "ASC" ? 1 : -1,
      };
    } else {
      sort = {
        name: 1,
      };
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
        : await LeavesManagement.find({ criteria })
          .sort({
            [sort_key]: sort_direction,
          })
          .populate({
            path: "userId",
            select: ["firstname", "lastname", "email", "profile"],
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
        leaveFrom: moment(req.body.leaveFrom).utc(false),
        leaveTo: moment(req.body.leaveTo).utc(false),
        status: "pending",
      };
      //find user data
      let userData = await UserSchema.findOne(
        {
          _id: req.params.id,
        },
        {
          totalAvailablePaidLeave: 1,
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
          (userData.totalAvailablePaidLeave >= data.totalDay &&
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
            .status(200)
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
        leaveFrom: moment(req.body.leaveFrom).utc(false),
        leaveTo: moment(req.body.leaveTo).utc(false),
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

        await LeavesManagement.updateOne(
          {
            _id: req.params.id,
          },
          data
        );
        return res
          .status(200)
          .json({ success: true, data: data, message: "Successfully leave Data Updated" });
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
      let { page, limit, sortField, sortValue } = req.query;
      let sort = {};
      let whereClause = { isDeleted: false };
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
              totalAvailablePaidLeave: 1,
            }
          );

          //chek leave type & update count
          if (leaveData.isPaid == true) {
            userData.totalAvailablePaidLeave =
              userData.totalAvailablePaidLeave + leaveData.totalDay;
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
              totalAvailablePaidLeave: userData.totalAvailablePaidLeave,
            }
          );
        }
      }
      await LeavesManagement.updateOne(
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
        select: ["totalAvailablePaidLeave", "totalUnpaidLeave", "_id"],
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
        leaveData.userId.totalAvailablePaidLeave =
          leaveData.userId.totalAvailablePaidLeave - leaveData.totalDay;
      }
      if (leaveData.isPaid == false) {
        leaveData.userId.totalUnpaidLeave =
          leaveData.userId.totalUnpaidLeave + leaveData.totalDay;
      }
      await UserSchema.updateOne(
        {
          _id: leaveData.userId._id,
        },
        {
          totalAvailablePaidLeave: leaveData.userId.totalAvailablePaidLeave,
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
      await LeavesManagement.updateOne(
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
      let currentYear = moment().year();
      let publicHolidayList = {
        holidayList: [
          {
            holidayName: "Makar Sankranti",
            holidayDate: "01/14/2022",
          },
          {
            holidayName: "Republic Day",
            holidayDate: "01/26/2022",
          },
          {
            holidayName: "Holi",
            holidayDate: "03/18/2022",
          },
          {
            holidayName: "Ramzan Eid",
            holidayDate: "05/03/2022",
          },
          {
            holidayName: "Rakshbandhan",
            holidayDate: "08/11/2022",
          },
          {
            holidayName: "Independence Day",
            holidayDate: "08/15/2022",
          },
          {
            holidayName: "Janmashtami",
            holidayDate: "08/18/2022",
          },
          {
            holidayName: "Diwali",
            holidayDate: "10/24/2022",
          },
          {
            holidayName: "New Year",
            holidayDate: "10/25/2022",
          },
          {
            holidayName: "Bhai Dooj",
            holidayDate: "10/26/2022",
          },
          {
            holidayName: "Christmas",
            holidayDate: "12/25/2022",
          },
        ],
        year: currentYear,
        isDeleted: false,
      };
      return res.status(200).json({
        success: true,
        data: publicHolidayList,
        message: "",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUpcomingLeaves(req, res) {
    try {
      let condition = {
        isDeleted: {
          $ne: true,
        },
        status: "pending",
        userId: req.params.userId,
      };
      condition["leaveFrom"] = {
        $gte: getUtcTime(req.body.leaveFrom, timezone, "YYYY/MM/DD HH:mm:ss"),
      };

      let query = [
        {
          $match: condition,
        },
      ];
      let data = await LeavesManagement.aggregate(query).allowDiskUse(true);

      return res.status(200).json({
        success: true,
        data: data,
        message: "",
      });
    } catch (error) {
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

/**
 * Function is used for get utc time
 * @param {*} input_time
 * @param {*} utc_offset
 * @param {*} input_format
 * @param {*} output_format
 */
const getUtcTime = (
  input_time,
  utc_offset,
  input_format,
  output_format = true
) => {
  let dateObject = moment(input_time, input_format);
  if (output_format == true) {
    return dateObject
      .add(convertUtcOffsetToMinute(utc_offset), "minute")
      .toDate();
  } else {
    return dateObject
      .add(convertUtcOffsetToMinute(utc_offset), "minute")
      .format(output_format);
  }
};

/**
 * This function is used for convert timezone into minutes
 * @param {*} tz
 */
const convertUtcOffsetToMinute = (tz) => {
  let offset = tz.split(":");
  offset[0] = parseInt(offset[0]);
  offset[1] = parseInt(offset[1]);
  let tz_minute = Math.abs(offset[0]) * 60 + Math.abs(offset[1]);
  if (offset[0] < 0) {
    tz_minute = tz_minute * -1;
  }
  return tz_minute * -1;
};

module.exports = new LeaveController();