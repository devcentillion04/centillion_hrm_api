const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const holidaySchema = new Schema(
  {
    holidayList: {
      type: Schema.Types.Mixed,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    year: {
      type: String,
      required: true,
    },
  }
  // { timestamps: true, toJSON: { virtuals: true } }
);

holidaySchema.plugin(paginate);

module.exports.holidaySchema = mongoose.model("holidayList", holidaySchema);
