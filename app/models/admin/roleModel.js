const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      max: 255,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Types.ObjectId,
      trim: true,
      max: 2000,
      required: true,
      default: null,
    },
    permissions: {
      type: [Types.ObjectId],
      trim: true,
      max: 255,
      required: true,
      default: null,
      ref: "permission_schema",
    },
    isEnabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

RoleSchema.plugin(paginate);

module.exports = mongoose.model("role_schema", RoleSchema);
