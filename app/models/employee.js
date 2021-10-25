const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

employeeSchema.plugin(paginate);

module.exports = mongoose.model("employee", employeeSchema);
