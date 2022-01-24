const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
// const { string } = require("yup/lib/locale");
const Schema = mongoose.Schema;

const designationSchema = new Schema(
    {
        designation: {
            type: String
        },
        label: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

designationSchema.plugin(paginate);

module.exports.designationSchema = mongoose.model("designation", designationSchema);
