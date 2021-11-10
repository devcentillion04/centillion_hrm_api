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
        let date = moment(req.body.clockIn)
          .startOf("day")
          .utc(true)
          .toISOString();
        let diff = moment(date).diff(moment(attendance.clockIn), "hours");
        let payload = {
          workingHours: diff,
          userId: req.currentUser._id,
        };

        let entryId = await Attendance.findOne({
          $push:{entry: {In:{ $elemMatch: { _id: req.body._id } }}}
        });
        let out = await Attendance.findOne({Out:req.params._id})
        console.log(out)
        let updateAttendance = await Attendance.findOneAndUpdate(
          {
            criteria,
            clockOut:date,
            payload,
            upsert: true,
            new: true,
            $push:{
              entry: {
              Out: moment(),
            }},
          },
        );
        return res.status(200).json({ success: true, data: updateAttendance });
      } else {
        let date = moment(req.body.clockIn).utcOffset("+05:30");
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
      let data = await Attendance.findById(id).populate({ path:"userId"}).populate({path:"userId",select:"email"});
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AttendanceController();
