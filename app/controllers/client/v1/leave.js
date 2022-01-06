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
        // let publicHolidayList = await holidaySchema.findOne({
        //   isDeleted: false,
        //   year: "2022",
        // });
        let publicHolidayList = {
          // "_id" : ObjectId("61d6ce85fcf46886bb63783a"),
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

        await leaveData.save();
        return res.status(200).json({ success: true, data: leaveData });
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
      await LeavesManagement.findOneAndUpdate(
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
      let leaveData = await LeavesManagement.findOne(
        {
          _id: req.params.id,
        }.populate({
          path: "userId",
          select: ["totalPaidLeave", "totalUnpaidLeave", "_id"],
        })
      );
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
      // let userData = await UserSchema.findOne(
      //   {
      //     _id: leaveData.userId,
      //   },
      //   {
      //     totalPaidLeave: 1,
      //     totalUnpaidLeave: 1,
      //   }
      // );
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
          _id: userData._id,
        },
        {
          totalPaidLeave: userData.totalPaidLeave,
          totalUnpaidLeave: userData.totalUnpaidLeave,
        }
      );

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
      await LeavesManagement.findOneAndUpdate(
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
