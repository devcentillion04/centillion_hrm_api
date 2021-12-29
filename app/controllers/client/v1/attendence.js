const { json } = require("body-parser");
const moment = require("moment-timezone");
const Attendance = require("../../../models/attendence");

class AttendanceController {
  async index(req, res) {
    try {
      let attendence = await Attendance.findById(req.params.id);
      return res.status(200).json({ success: true, data: attendence });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async create(req, res) {
    try {
      let criteria = {
        workDate: moment().startOf("day").utc(true).add("days"),
        userId: req.currentUser._id,
      };

      // let getId = await Attendance.findOne(userId);
      // console.log(getId);
      let attendance = await Attendance.findOne(criteria);
      if (attendance) {
        let date = moment().utc(true);
        let payload = {
          clockOut: date,
        };
        let dataTime;
        let time;
        let b = attendance.entry;
        let abvc = b[b.length - 1];
        if (abvc?.Out != undefined) {
          dataTime = {
            $push: {
              entry: {
                In: moment().utc(true),
              },
            },
          };
        } else if (abvc?.In != undefined) {
          dataTime = {
            $push: {
              entry: {
                Out: moment().utc(true),
              },
            },
          };
          if (attendance.workingHours) {
            time =
              moment(dataTime.$push.entry.Out).diff(abvc?.In, "milliseconds") +
              attendance.workingHours;
          } else {
            time = moment(dataTime.$push.entry.Out).diff(
              abvc?.In,
              "milliseconds"
            );
          }
        }
        let updateAttendance = await Attendance.findOneAndUpdate(
          { _id: attendance._id },
          { ...payload, workingHours: time, ...dataTime },
          {
            upsert: true,
            new: false,
          }
        );
        return res.status(200).json({ success: true, data: updateAttendance });
      } else {
        let date = moment().utc(true);

        let newAttendance = new Attendance({
          userId: req.currentUser._id,
          clockIn: date,
          entry: {
            In: moment().utc(true),
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
      let { id } = req.params;
      let user = {};
      if (id) {
        user = { ...req.params._id, userId: id };
      } else {
        user = { ...req.params._id };
      }
      let data = await Attendance.find(user)
        .populate({ path: "userId" })
        .populate({ path: "userId", select: "email" });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async update(req, res) {
    try {
      let payload = {
        clockIn: moment(req.body.clockIn).utc(true),
        clockOut: moment(req.body.clockOut).utc(true),
      };
      const attendence = await Attendance.findOneAndUpdate(
        req.params.id,
        payload,
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, data: attendence });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async userAttendence(req, res) {
    try {
      let payload = {
        workDate: moment().startOf("day").utc(true).add("days"),
      };
      let attendence = await Attendance.find(payload);
      return res.status(200).json({ success: true, data: attendence });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AttendanceController();
