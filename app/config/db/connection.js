const mongoose = require("mongoose");

module.exports = mongoose
  .connect(`${process.env.MONGO_URL}/${process.env.MONGO_DB}`)
  .then(() => {
    console.log("DATABASE CONNECTED");
    console.log("=================================");
  })
  .catch((error) => {
    console.log("DATABASE NOT CONNCTED");
    console.log("=================================");
  });
