const moment = require("moment-timezone");
const Attendance = require("../../../models/attendence");

class AttendanceController {
  async index(req, res) {
    try {
      let { page, limit, sortField, sortValue } = req.query;
      let sort = {};
      let whereClause = {};
      if (sortField) {
        sort = {
          [sortField]: sortValue === "ASC" ? 1 : -1,
        };
      } else {
        sort = {
          name: 1,
        };
      }
      if (req.query.type) {
        Object.assign(whereClause, { type: req.query.type });
      }

      let attendence = await Attendance.find(whereClause)
        .skip(page > 0 ? +limit * (+page - 1) : 0)
        .limit(+limit || 20)
        .sort(sort)
        .populate({
          path: "userId",
          select: ["firstname", "lastname", "email", "profile"],
        });

      return res.status(200).json({
        success: true,
        data: attendence,
      });
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
          if ((attendance.workingHou, rs)) {
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
      let { page, limit, sortField, sortValue } = req.query;
      let sort = {};
      let whereClause = {};
      if (sortField) {
        sort = {
          [sortField]: sortValue === "ASC" ? 1 : -1,
        };
      } else {
        sort = {
          name: 1,
        };
      }

      let attendence = await Attendance.find(user, whereClause)
        .skip(page > 0 ? +limit * (+page - 1) : 0)
        .limit(+limit || 20)
        .sort(sort)
        .populate({
          path: "userId",
          select: ["firstname", "lastname", "email", "profile"],
        });
      return res.status(200).json({
        success: true,
        data: attendence.docs ? attendence.docs : attendence,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async update(req, res) {
    try {
      const data = await Attendance.findById({ userId: req.body.userId });
      console.log(data);
      let payload = {
        clockIn: moment(req.body.clockIn).utc(true),
        clockOut: moment(req.body.clockOut).utc(true),
        workingHours: req.body.workingHours,
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
        workDate: moment().startOf("day").utc(true),
      };
      let { page, limit, sortField, sortValue } = req.query;
      let sort = {};
      let whereClause = {};
      if (sortField) {
        sort = {
          [sortField]: sortValue === "ASC" ? 1 : -1,
        };
      } else {
        sort = {
          name: 1,
        };
      }

      let attendence = await Attendance.find(payload)
        .skip(page > 0 ? +limit * (+page - 1) : 0)
        .limit(+limit || 20)
        .sort(sort)
        .populate({
          path: "userId",
          select: ["firstname", "lastname", "email", "profile"],
        });
      return res.status(200).json({
        success: true,
        data: attendence,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async clock(req, res) {
    try {
      let loggedInUser = req.currentUser;
      let criteria = {
        userId: loggedInUser._id,
        workDate: moment().startOf("day").utc(true).toISOString(),
      };
      let payload = {};

      let existing_attendance = await Attendance.findOne(criteria);
      if (existing_attendance) {
        let attendance_entries = existing_attendance.entry;
        let last_attendance_entry =
          attendance_entries[attendance_entries.length - 1];
        if (last_attendance_entry?.In && last_attendance_entry?.Out) {
          let entry_payload = {
            In: moment().utc(true).toISOString(),
          };
          attendance_entries.push(entry_payload);
        } else {
          last_attendance_entry.Out = moment().utc(true).toISOString();
        }

        let minutes = moment(last_attendance_entry.Out).diff(
          last_attendance_entry.In,
          "minutes"
        );

        console;

        payload = {
          entry: attendance_entries,
          workingHours: minutes,
        };
      } else {
        payload = {
          ...criteria,
          clockIn: moment().utc(true).toISOString(),
          entry: {
            In: moment().utc(true).toISOString(),
          },
        };
      }

      let attendance = await Attendance.findOneAndUpdate(criteria, payload, {
        upsert: true,
        new: true,
      }).lean();

      let last_attendance_entry = attendance?.entry.length
        ? attendance?.entry[attendance?.entry.length - 1]
        : null;

      let result = {
        ...attendance,
        clock:
          last_attendance_entry?.In && last_attendance_entry?.Out
            ? "CLOCK IN"
            : last_attendance_entry?.Out
            ? "CLOCK IN"
            : "CLOCK OUT",
      };

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCurrentUserAttendance(req, res) {
    try {
      let loggedInUser = req.currentUser;
      let criteria = {
        userId: loggedInUser._id,
        workDate: moment().startOf("day").utc(true).toISOString(),
      };

      let attendance = await Attendance.findOne(criteria).lean();
      let last_attendance_entry = attendance?.entry.length
        ? attendance?.entry[attendance?.entry.length - 1]
        : null;
      let result = {
        ...attendance,
        clock:
          last_attendance_entry?.In && last_attendance_entry?.Out
            ? "CLOCK IN"
            : last_attendance_entry?.Out
            ? "CLOCK IN"
            : "CLOCK OUT",
      };
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AttendanceController();
