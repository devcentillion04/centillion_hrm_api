
const { leaveAttendenceReqSchema } = require("../../../models/leaveAttendenceReq");
const AttendanceSchema = require("../../../models/attendence");
const { UserSchema } = require("../../../models/user");
const { LeavesManagement } = require("../../../models/leave");
const moment = require("moment-timezone");
const timezone = "+5:30";
class leaveAttendenceController {

    async index(req, res) {
        let { page, limit, sortField, sortValue, sort_key, sort_direction } = req.query;
        let sort = {};
        let criteria = { isDeleted: false };
        if (sortField) {
            sort = {
                [sortField]: sortValue === "AES" ? 1 : -1,
            };
        } else {
            sort = {
                createdAt: -1,
            };
        }
        var populateData = {
            path: "userId",
            select: ["email", "firstname", "lastname", "profile"],
        };
        const options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            sort: { createdAt: -1 },
            populate: populateData,
        };

        let leave =
            req.query.page || req.query.limit
                ? await leaveAttendenceReqSchema.paginate(criteria, options)
                : await leaveAttendenceReqSchema.find({ criteria })
                    .sort({
                        createdAt: -1,
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
     * Create request entry for leave/attendence
     * @param {*} req 
     * @param {*} res 
     * @returns 
     * 
     */
    async create(req, res) {
        try {
            let userData = await UserSchema.findOne(
                {
                    _id: req.currentUser._id,
                    isDeleted: false
                },
                {
                    totalAvailablePaidLeave: 1,
                    totalUnpaidLeave: 1,
                    teamLeader: 1
                }
            );
            let data = {
                ...req.body,
                startDate: moment(req.body.startDate).utc(false),
                endDate: moment(req.body.endDate).utc(false),
                requestedTo: userData.teamLeader,
                userId: req.currentUser._id,
                status: "Pending"
            }
            let resData = await processData(req.body, data, userData);
            if (resData && resData.data && resData.isCreatedFlag && Object.keys(resData.data).length > 0) {
                let reqData = new leaveAttendenceReqSchema(resData.data);
                await reqData.save();
                return res.status(200).json({ success: true, message: data.requestType + " Request added successfully" });
            } else {
                return res.status(500).json({ success: false, message: resData.message });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Approve Request for leave/attendence by team leader
     * @param {*} req 
     * @param {*} res 
     * @returns object
     */
    async approve(req, res) {
        try {
            let requestedData = await leaveAttendenceReqSchema.findOne({
                _id: req.params.id
            }).populate({
                path: "userId",
                select: ["totalAvailablePaidLeave", "totalUnpaidLeave", "_id"],
            });
            let isUpdateFlag = false;
            if (requestedData) {
                if (requestedData.requestType == "attendance") {
                    let attendenceData = {
                        userId: requestedData.userId,
                        clockIn: moment(requestedData.startDate).utc(false),
                        workDate: moment(requestedData.startDate).startOf("day").utc(true).toISOString(),
                        clockOut: moment(requestedData.endDate).utc(false),
                        workingHours: requestedData.totalHours
                    }
                    let data = await new AttendanceSchema({
                        ...attendenceData,
                    });
                    await data.save();
                    isUpdateFlag = true;
                }
                if (requestedData.requestType == "leave") {
                    let data = {
                        reason: requestedData.reason,
                        leaveType: requestedData.leaveType,
                        approvedBy: req.currentUser._id,
                        isApproved: true,
                        status: "approved",
                        approveDate: moment(),
                        leaveFrom: requestedData.startDate,
                        leaveTo: requestedData.endDate,
                        totalDay: requestedData.totalDay,
                        userId: requestedData.userId
                    }
                    if (requestedData.type == "PaidLeave") {
                        data.isPaid = true;
                    }
                    if (requestedData.type == "UnpaidLeave") {
                        data.isPaid = false;
                    }

                    if (data.isPaid == true) {
                        requestedData.userId.totalAvailablePaidLeave =
                            requestedData.userId.totalAvailablePaidLeave - requestedData.totalDay;
                    }
                    if (data.isPaid == false) {
                        requestedData.userId.totalUnpaidLeave =
                            requestedData.userId.totalUnpaidLeave + requestedData.totalDay;
                    }

                    let leaveData = await new LeavesManagement({
                        ...data,
                    });

                    await leaveData.save(); //create leave document
                    await UserSchema.updateOne(
                        {
                            _id: requestedData.userId,
                        },
                        {
                            totalAvailablePaidLeave: requestedData.userId.totalAvailablePaidLeave,
                            totalUnpaidLeave: requestedData.userId.totalUnpaidLeave,
                        }
                    );
                    isUpdateFlag = true;
                }
                if (isUpdateFlag) {
                    let requesTypeData = await leaveAttendenceReqSchema.findOneAndUpdate({
                        _id: req.params.id
                    }, {
                        // approvedBy: Types.ObjectId(req.currentUser._id),
                        approvedBy: req.currentUser._id,
                        status: "Approved",
                        approveDate: moment()
                    });
                    return res.status(200).json({ success: true, message: "Successfully " + requesTypeData.requestType + "Document Added" });
                } else {
                    return res.status(500).json({ success: false, message: "Error while proces request data" });
                }
            } else {
                return res.status(500).json({ success: false, message: "Error while update document" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAllRequestById(req, res) {
        try {
            let requestedData = await leaveAttendenceReqSchema.find({
                requestedTo: req.currentUser._id,
                isDeleted: false,
                status: "Pending"
            }).populate({
                path: "userId",
                select: ["firstname", "lastname", "email", "profile"],
            });;
            return res.status(200).json({ success: true, message: "Successfully get all requests documents", data: requestedData });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Delete Request enry by user id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async delete(req, res) {
        try {
            await leaveAttendenceReqSchema.updateOne({
                _id: req.params.id,
            }, {
                isDeleted: true
            });
            return res.status(200).json({ success: true, message: "Successfully deleted requestedEntry" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async rejectRequest(req, res) {
        try {
            await leaveAttendenceReqSchema.findOne({
                _id: req.params.id,
                isDeleted: false
            }, {
                status: "Rejected",
                rejectedBy: req.currentUser._id,
                rejectDate: moment()
            });
            return res.status(200).json({ success: true, message: "Successfully Rejected requestedEntry" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            let userData = await UserSchema.findOne(
                {
                    _id: req.currentUser._id,
                    isDeleted: false
                },
                {
                    totalAvailablePaidLeave: 1,
                    totalUnpaidLeave: 1,
                    teamLeader: 1
                }
            );
            let data = {
                ...req.body,
                startDate: moment(req.body.startDate).utc(false),
                endDate: moment(req.body.endDate).utc(false)
            }
            let resData = await processData(req.body, data, userData);
            if (resData && resData.data && resData.isCreatedFlag && Object.keys(resData.data).length > 0) {
                await leaveAttendenceReqSchema.updateOne(
                    {
                        _id: req.params.id,
                    },
                    resData.data
                );
                return res.status(200).json({ success: true, data: {}, message: data.requestType + " Request updated successfully" });
            } else {
                return res.status(500).json({ success: false, message: resData.message });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: error.message });

        }
    }
};

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

const processData = (reqData, data, userData) => {
    return new Promise((resolve, reject) => {
        let start = moment(reqData.startDate, "YYYY-MM-DD").utc(false);
        let currentDate = moment().format("YYYY-MM-DD");
        let leaveFlag = moment(currentDate).isAfter(start, "days");
        let leaveDaysCount = workingDaysCount(data.startDate, data.endDate);
        let publicHolidayList = {
            holidayList: [
                {
                    holidayName: "Makar Sankranti",
                    holidayDate: "2022/01/14",
                },
                {
                    holidayName: "Republic Day",
                    holidayDate: "2022/01/26",
                },
                {
                    holidayName: "Holi",
                    holidayDate: "2022/03/18",
                },
                {
                    holidayName: "Ramzan Eid",
                    holidayDate: "2022/05/03",
                },
                {
                    holidayName: "Rakshbandhan",
                    holidayDate: "2022/08/11",
                },
                {
                    holidayName: "Independence Day",
                    holidayDate: "2022/08/15",
                },
                {
                    holidayName: "Janmashtami",
                    holidayDate: "2022/08/18",
                },
                {
                    holidayName: "Diwali",
                    holidayDate: "2022/10/24",
                },
                {
                    holidayName: "New Year",
                    holidayDate: "2022/10/25",
                },
                {
                    holidayName: "Bhai Dooj",
                    holidayDate: "2022/10/26",
                },
                {
                    holidayName: "Christmas",
                    holidayDate: "2022/12/25",
                },
            ],
            year: "2022"
        }
        let publicHolidayCount = 0;
        publicHolidayList.holidayList.forEach((element) => {
            if (!(element.day == "Sunday" || element.day == "Satuerday")) {
                let date = moment(element.holidayDate, "YYYY-MM-DD").format(
                    "YYYY-MM-DD"
                );
                if (moment(date).isBetween(data.startDate, data.endDate) || moment(date).isSame(data.startDate) || moment(date).isSame(data.endDate)) {
                    publicHolidayCount++;
                }
            }
        });
        leaveDaysCount = leaveDaysCount - publicHolidayCount;
        //check valid leave apply or not
        if (leaveFlag && leaveDaysCount > 0) {
            if (reqData.requestType == "leave") {
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
                data.totalDay = leaveDaysCount * leaveCount;
                //update isPaid flag accroding to leave type
                if (
                    (userData.totalAvailablePaidLeave >= data.totalDay &&
                        data.type == "PaidLeave") ||
                    data.type == "UnpaidLeave"
                ) {
                    resolve({
                        isCreatedFlag: true,
                        data: data
                    });
                } else {
                    resolve({
                        isCreatedFlag: false,
                        data: {},
                        message: "Not Available for Paid Leave"
                    });
                }
            } else if (reqData.requestType == "attendance") {
                if (moment(data.startDate).isSame(data.endDate)) {
                    resolve({
                        isCreatedFlag: true,
                        data: data
                    });
                } else {
                    resolve({
                        isCreatedFlag: false,
                        data: {},
                        message: "Please Select valid date for attendence request"
                    });
                }
            }
        } else {
            resolve({
                isCreatedFlag: false,
                data: {},
                message: "Please Select valid date"
            });
        }
    })
}


module.exports = new leaveAttendenceController();