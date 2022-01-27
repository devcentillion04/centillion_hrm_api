
const { leaveAttendenceReqSchema } = require("../../../models/leaveAttendenceReq")
const moment = require("moment-timezone");
const AttendanceSchema = require("../../../models/attendence");
const { UserSchema } = require("../../../models/user");
const { Types } = require("mongoose");
const { LeavesManagement } = require("../../../models/leave");
class leaveAttendenceController {

    async index(req, res) {
        try {
            let sort_key = req.query.sort_key;
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

            let data =
                req.query.page || req.query.limit
                    ? await leaveAttendenceReqSchema.paginate(criteria, options)
                    : await leaveAttendenceReqSchema
                        .find(criteria)
                        .sort({ [sort_key]: sort_direction }).populate({
                            path: "userId",
                            select: ["firstname", "lastname", "email", "profile"],
                        });

            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            return res.status(500).json({ succcess: false, message: error.message });
        }
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
                requestedTo: userData.teamLeader,
                userId: req.currentUser._id
            }
            if (req.body.requestType == "leave") {
                data.startDate = moment(req.body.startDate).utc(false);
                data.endDate = moment(req.body.endDate).utc(false);
                let start = moment(data.startDate, "YYYY-MM-DD");
                let end = moment(data.endDate, "YYYY-MM-DD");
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
                            if (moment(date).isBetween(start, end) || moment(date).isSame(start) || moment(date).isSame(end)) {
                                publicHolidayCount++;
                            }
                        }
                    });
                    leaveDaysCount = leaveDaysCount - publicHolidayCount;
                    if (leaveDaysCount > 0) {
                        data.totalDay = leaveDaysCount * leaveCount;
                        //update isPaid flag accroding to leave type
                        if (
                            (userData.totalAvailablePaidLeave >= data.totalDay &&
                                data.type == "PaidLeave") ||
                            data.type == "UnpaidLeave"
                        ) {
                            let reqData = await new leaveAttendenceReqSchema(data);
                            await reqData.save();
                            return res.status(200).json({ success: true, message: "Leave Request added successfully" });
                        } else {
                            return res
                                .status(500)
                                .json({ success: false, data: "Not Available for Paid Leave" });
                        }
                    } else {
                        return res
                            .status(500)
                            .json({ success: false, data: "Please Select valid Date" });
                    }
                } else {
                    return res
                        .status(500)
                        .json({ success: false, data: "Please Select Valid Date" });
                }

            } else {
                let reqData = new leaveAttendenceReqSchema(data);
                await reqData.save();
                return res.status(200).json({ success: true, message: "Attendance Request added successfully" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    //Approve Request for leave/attendence by team leader
    async approve(req, res) {
        try {
            let requestedData = await leaveAttendenceReqSchema.findOne({
                _id: req.currentUser._id
            }).populate({
                path: "userId",
                select: ["totalAvailablePaidLeave", "totalUnpaidLeave", "_id"],
            });
            let isUpdateFlag = false;
            if (requestedData) {
                if (requestedData.requestType == "attendance") {
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
                    isUpdateFlag = true;
                }
                if (requestedData.requestType == "leave") {
                    let data = {
                        reason: requestedData.reason,
                        leaveType: requestedData.leaveType,
                        approvedBy: req.body.approvedBy,
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
                        userId: req.body.approvedBy,
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
                        isApproved: true
                    });
                    return res.status(200).json({ success: true, message: "Successfully " + requesTypeData.requestType + "Document Added" });
                } else {
                    return res.status(500).json({ success: false, message: "Error while proces request data" });
                }
            } else {
                return res.status(500).json({ success: false, message: "Error while update document" });
            }

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * get all requested entry by team leader id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getAllRequestById(req, res) {
        try {

            let requestedData = await leaveAttendenceReqSchema.find({
                requestedTo: req.currentUser._id,
                isDeleted: false,
                isApproved: false
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
                isApproved: false
            }, {
                isDeleted: true
            });

            return res.status(200).json({ success: true, message: "Successfully deleted requestedEntry" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
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


module.exports = new leaveAttendenceController();