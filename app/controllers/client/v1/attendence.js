const jwt = require("jsonwebtoken");
const moment = require("moment");
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
        workDate: moment().startOf("day").utc(true).toISOString(),
        userId: "",
      };
      let attendance = await Attendance.findOne(criteria);
      console.log(attendance);
      if (attendance) {
        let clockOut = moment(req.body.clockIn)
          .startOf("day")
          .utc(true)
          .add(20, "hours");
        let diff = moment(clockOut).diff(moment(attendance.clockIn), "hours");
        let payload = {
          clockOut: clockOut,
          workingHours: diff,
        };

        let updateAttendance = await Attendance.findOneAndUpdate(
          criteria,
          payload,
          {
            upsert: true,
            new: true,
          }
        );
        return res.status(200).json({ success: false, data: updateAttendance });
      } else {
        let newAttendance = new Attendance({
          ...req.body,
          clockIn: moment(req.body.clockIn)
            .startOf("day")
            .utc(true)
            .add(10, "hours"),
          workDate: moment().startOf("day").utc(true).toISOString(),
        });
        await newAttendance.save();
        return res.status(200).json({ success: true, data: newAttendance });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    // let date1 = moment(req.body.date).format("YYYY-MM-DD hh:mm:ss");
    // console.log("date", date1);
    // let time = {
    //   clockin: moment(req.body.date).format("YYYY-MM-DD hh:mm:ss"),
    //   clockout: new Date(),
    // };
    // let payload = {
    //   ...req.body,
    //   time,
    // };
    // let attendence = new AttendenceDetails(payload);
    // await attendence.save();
    // return res.status(200).json({ success: true, data: attendence });
  }
  catch(error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  async update(res, req) {
    try {
      let payload = {
        ...req.body,
      };
      let attendence = await Attendance.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, data: attendence });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async show(req, res) {
    try {
      const { id } = req.params;
      let data = await Attendance.findById(id);
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AttendanceController();
