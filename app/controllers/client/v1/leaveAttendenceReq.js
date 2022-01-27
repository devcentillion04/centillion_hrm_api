
const { leaveAttendenceReqSchema } = require("../../../models/leaveAttendenceReq")
const moment = require("moment-timezone");
const AttendanceSchema = require("../../../models/attendence");
const { UserSchema } = require("../../../models/user");
class leaveAttendenceController {

    async index(req, res) {
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
            //find user data
            let userData = await UserSchema.findOne(
                {
                    _id: req.user.id,
                    isDeleted: false
                },
                {
                    totalAvailablePaidLeave: 1,
                    totalUnpaidLeave: 1,
                    teamLeader: 1
                }
            );
            if (req.body.requestType == "leave") {
                let data = {
                    ...req.body,
                    leaveFrom: moment(req.body.startDate).utc(false),
                    leaveTo: moment(req.body.endDate).utc(false)
                };
                let start = moment(data.leaveFrom, "YYYY-MM-DD");
                let end = moment(data.leaveTo, "YYYY-MM-DD");
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
                                console.log(publicHolidayCount);
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
                            let { id } = req.params;
                            if (data.type == "PaidLeave") {
                                data.isPaid = true;
                            }
                            if (data.type == "UnpaidLeave") {
                                data.isPaid = false;
                            }
                            // let leaveData = await new LeavesManagement({
                            //     ...data,
                            //     userId: id,
                            // });

                            // await leaveData.save(); //create leave document

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
                let requestData = {
                    userId: req.user.id,
                    requestedTo: userData.teamLeader,
                    ...req.body
                }
                let data = new leaveAttendenceReqSchema(requestData);

                await data.save();
            }
            return res.status(200).json({ success: true, message: "Request added successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    //Approve Request for leave/attendence by team leader
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

    /**
     * get all requested entry by team leader id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
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


module.exports = new leaveAttendenceController();