
const { leaveAttendenceReqSchema } = require("../../../models/leaveAttendenceReq")
const moment = require("moment-timezone");
const AttendanceSchema = require("../../../models/attendence");
const { UserSchema } = require("../../../models/user");
class leaveAttendenceController {

    async create(req, res) {
        try {
            let userData = await UserSchema.findOne({
                _id: req.params.userId,
                isDeleted: false
            }, {
                teamLeader: 1
            });
            let requestData = {
                userId: req.params.userId,
                requestedTo: userData.teamLeader,
                ...req.body
            }
            let data = new leaveAttendenceReqSchema(requestData);

            await data.save();
            return res.status(200).json({ success: true, message: "Request added successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async approve(req, res) {
        try {
            let requestedData = await leaveAttendenceReqSchema.findOneAndUpdate({
                _id: req.params.id
            }, {
                approvedBy: req.user.id,
                isApproved: true
            });
            if (requestedData) {
                if (requestedData.requestType == "attendence") {
                    let attendenceData = {
                        userId: requestedData.userId,
                        clockIn: moment(requestedData.clockIn).utc(false),
                        workDate: moment(requestedData.clockIn).startOf("day").utc(false).toISOString(),
                        clockOut: moment(requestedData.clockOut).utc(false),
                        workingHours: requestedData.totalHours
                    }
                    let data = await new AttendanceSchema({
                        ...attendenceData,
                    });
                    await data.save();
                    return res.status(200).json({ success: true, message: "Successfully " + requestedData.requestType + "Document Added" });
                } else if (requestedData.requestType == "leave") {
                    return res.status(200).json({ success: true, message: "Successfully " + requestedData.requestType + "Document Added" });
                } else {
                    return res.status(500).json({ success: false, message: "Invalid type found in request data" });
                }
            } else {
                return res.status(500).json({ success: false, message: "Error while update document" });
            }

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAllRequestById(req, res) {
        try {
            let requestedData = await leaveAttendenceReqSchema.find({
                requestedTo: req.user.id,
                isDeleted: false
            });
            return res.status(200).json({ success: true, message: "Successfully get all requests documents", data: requestedData });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await leaveAttendenceReqSchema.updateOne({
                _id: req.params.id,
                isApproved: false
            }, {
                isDeleted: true
            });

            return res.status(200).json({ success: true, message: "Successfully deleted requestData" });

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};


module.exports = new leaveAttendenceController();