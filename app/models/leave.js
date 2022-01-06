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
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    leaveFrom: {
      type: Date,
      required: true,
    },
    leaveTo: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Array,
      ref: "User",
    },
    rejectedBy: {
      type: Array,
      ref: "User",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    totalDay: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
LeavesManagement.plugin(paginate);
module.exports.LeavesManagement = mongoose.model("leaves", LeavesManagement);
