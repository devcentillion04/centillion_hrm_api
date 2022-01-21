const cron = require("node-cron");
const moment = require("moment");
const { UserSchema } = require("../models/user");
const Attendance = require("../models/attendence");
const mongoose = require("mongoose");
cron.schedule("0 23 * * * *", async () => {
    try {
        let id = mongoose.Types.ObjectId("61e961bac72bbf8269a07974");
        let users = await UserSchema.find();
        console.log("test")
        for (let i = 0; i < users.length; i++) {
            console.log("update")
            let todayDate = moment().startOf("day").toISOString();
            let attendeesRecord = await Attendance.findOne({
                user: id,
                createdAt: { $gt: new Date(todayDate) },
            });
            if (!attendeesRecord?.clockOut) {
                if (!attendeesRecord.entry[attendeesRecord.entry.length - 1]?.out) {
                    let out = {
                        $push: {
                            entry: {
                                Out: moment().utc(false),
                            },
                        },
                    };
                    let outEntry = moment().toISOString();
                    payload = {};
                    let minutes = moment(outEntry).diff(
                        attendeesRecord.entry[attendeesRecord.entry.length - 1]?.In,
                        "minutes"
                    );
                    payload = {
                        ...payload,
                        ...out,
                        workingHours: minutes,
                        clockOut: outEntry,
                    };
                    console.log("payload", payload);

                    await Attendance.findOneAndUpdate(
                        { _id: attendeesRecord._id },
                        { ...payload },
                        {
                            upsert: true,
                            new: false,
                        }
                    );
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
});
