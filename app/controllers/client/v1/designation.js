const { designationSchema } = require("../../../models/designation");

class designationController {

    async index(req, res) {
        try {
            let sort_key = req.query.sort_key || "designation";
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
                    ? await designationSchema.paginate(criteria, options)
                    : await designationSchema
                        .find(criteria)
                        .sort({ [sort_key]: sort_direction });

            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            return res.status(500).json({ succcess: false, message: error.message });
        }
    }

    /**
     * Add designation
     * @param {*} req role & label
     * @param {*} res 
     * @returns 
     */
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

    /**
     * Update designation by designation
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async updateDesignation(req, res) {
        try {
            await designationSchema.updateOne({
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

    /**
     * Get All designation list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getAllDesignation(req, res) {
        try {
            let designation = await designationSchema.find({
                isDeleted: false
            });
            return res.status(200).json({ success: true, data: designation, message: "Successfully get all designation" });
        } catch {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Delete designation by designation id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async delete(req, res) {
        try {
            await designationSchema.updateOne({
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