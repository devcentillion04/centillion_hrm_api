const moment = require("moment-timezone");
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
        ...req.params._id,
      };
      let attendance = await Attendance.findOne(criteria);
      if (attendance) {
        let date = moment().utc(true)
        let payload = {
          userId: req.currentUser._id,
          clockOut: date,
        }
        let dataTime;
        let time;
        let b = attendance.entry
        let abvc = b[b.length - 1]
        if (abvc?.Out != undefined) {
          dataTime = {
            $push: {
              entry: {
                In: moment().utc(true)
              }
            }
          }

        }
        else if (abvc?.In != undefined) {
          dataTime = {
            $push: {
              entry: {
                Out: moment().utc(true)
              }
            }
          }
          time = moment().diff(moment(abvc?.In), "minutes")
          console.log("time", time)
        }
        else {
          dataTime = {
            $push: {
              entry: {
                In: moment().utc(true)
              }
            }
          }
        }
        let diff = moment(abvc?.Out).diff(abvc?.In, "minutes");
        let updateAttendance = await Attendance.findOneAndUpdate(
          {
            criteria,
            ...payload,
            workingHours: diff,
            upsert: true,
            new: true,
            ...dataTime,
          },
        );
        return res.status(200).json({ success: true, data: updateAttendance });
      } else {
        let date = moment().utc(true)
        let newAttendance = new Attendance({
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
      const { id } = req.params;
      let data = await Attendance.findById(id).populate({ path: "userId" }).populate({ path: "userId", select: "email" });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AttendanceController();
