const moment = require("moment");
const { token } = require("morgan");
const Attendance = require("../../../models/attendence");

class AttendanceController {
  async index(req, res) {
    let attendence = await Attendance.find(req.params.id);
    return res.status(200).json({ success: true, data: attendence });
  }
  catch(error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  async create(req, res) {
    try {
      let criteria = {
        workDate: moment().startOf("day").utc(true).add("days"),
        userId: token.userId,
      };
      let attendance = await Attendance.findOne(criteria);
      if (attendance) {
        let clockOut = moment(req.body.clockIn)
          .startOf("day")
          .utc(true)
          .toISOString();
        let diff = moment(clockOut).diff(moment(attendance.clockIn), "hours");
        let payload = {
          clockOut: clockOut,
          workingHours: diff,
          userId: req.currentUser._id,
        };
        let entryId = await Attendance.findOne({
          entry: { $elemMatch: { _id: req.body._id } },
        });
        console.log("entryId", entryId);
        let updateAttendance = await Attendance.findOneAndUpdate(
          {
            criteria,
            payload,
            upsert: true,
            new: true,
            entryId,
          },
          { $push: { entry: { Out: moment() } } }
        );
        return res.status(200).json({ success: true, data: updateAttendance });
      } else {
        let date = moment().utcOffset("+05:30");
        let newAttendance = new Attendance({
          ...req.body,
          clockIn: date,
          entry: {
            In: moment(),
          },
          workDate: moment().startOf("day").utc(true).toISOString(),
        });
        await newAttendance.save();
        return res.status(200).json({ success: true, data: newAttendance });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  catch(error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  async show(req, res) {
    try {
      const { id } = req.params;
      let data = await Attendance.findById(id).populate("userId");
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AttendanceController();
