const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const LeavesManagement = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
    },
    leaveTypes: {
      type: String,
    },
    leaveFrom: {
      type: Date,
    },
    leaveTo: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
LeavesManagement.plugin(paginate);
module.exports.LeavesManagement = mongoose.model("leaves", LeavesManagement);
