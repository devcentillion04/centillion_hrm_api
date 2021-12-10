const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const PermissionSchema = new Schema(
  {
    path: {
      type: String,
      trim: true,
      max: 255,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      trim: true,
      max: 255,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      trim: true,
      max: 2000,
      default: null,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

PermissionSchema.plugin(paginate);

module.exports = mongoose.model("permission_schema", PermissionSchema);
