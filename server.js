const express = require("express");
const { json, urlencoded } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

console.log(process.env.DOTENV_CONFIG_PATH);

require("dotenv").config({ path: process.env.DOTENV_CONFIG_PATH });

// console.log(process.env);
require("./app/config/db/connection");
const clientRoutes = require("./app/routes/index");
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
