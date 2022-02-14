const express = require("express");
const { json, urlencoded } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const fs = require('fs');
// require("./app/cronJob/clockout");
// require("./app/cronJob/attendanceMail");
if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}
if (!fs.existsSync("./upload")) {
  fs.mkdirSync("./upload");
}

if (!fs.existsSync("./upload/salarySlip")) {
  fs.mkdirSync("./upload/salarySlip");
}

require("dotenv").config({ path: process.env.DOTENV_CONFIG_PATH });
require("./app/config/db/connection");
const clientRoutes = require("./app/routes");
const adminRoutes = require("./app/routes/admin");
const app = express();
const router = express.Router();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(`/api/${process.env.VERSION}`, router);
app.use(express.static("public"));

router.use("/admin", adminRoutes);
router.use("/", clientRoutes);

app.listen(process.env.PORT, () => {
  console.log("=================================");
  console.log("DEVELOPMENT SERVER STARTED", process.env.PORT);
  console.log("=================================");
});
