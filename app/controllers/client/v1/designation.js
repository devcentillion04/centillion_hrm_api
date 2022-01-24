const { designationSchema } = require("../../../models/designation");

class designationController {

    async addDesignation(req, res) {
        try {
            let obj = {
                ...req.body
            }
            let designationData = new designationSchema(obj);
            await designationData.save();
            return res.status(200).json({ success: true, message: "Designation added successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateDesignation(req, res) {
        try {
            await designationSchema.findOneAndUpdate({
                _id: req.params.id,
                isDeleted: false
            }, {
                designation: req.body.designation,
                label: req.body.label
            });
            return res.status(200).json({ success: true, message: "Designation updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAllDesignation(req, res) {
        try {
            let designation = await designationSchema.find({
                isDeleted: false
            });
            return res.status(200).json({ success: false, data: designation, message: "Successfully get all designation" });
        } catch {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await designationSchema.findOneAndUpdate({
                _id: req.params.id
            }, {
                isDeleted: true
            });
            return res.status(200).json({ success: true, message: "designation deleted successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = new designationController();