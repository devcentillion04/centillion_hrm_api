const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    mobileno: {
      type: Number,
    },
    alternateMobileno: {
      type: Number,
    },
    address: {
      street1: {
        type: String,
      },
      street2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      area: {
        type: String,
      },
      pincode: {
        type: Number,
      },
    },
    personalDetails: {
      aadharCard: {
        type: Number,
      },
      panCard: {
        type: String,
      },
    },
    bankDetails: {
      bankName: {
        type: String,
      },
      accountno: {
        type: Number,
      },
      ifscCode: {
        type: String,
      },
      branchName: {
        type: String,
      },
    },
    profile: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "ADMIN",
    },
    employeeType: {
      type: String,
      enum: ["PARTTIME", "FULLTIME"],
      default: "FULLTIME",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

UserSchema.plugin(paginate);

module.exports.UserSchema = mongoose.model("User", UserSchema);