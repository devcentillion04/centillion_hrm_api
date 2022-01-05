const { UserSchema } = require("../../../models/user");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
let secretOrKey = process.env.JWT_SECRET;
const { CONSTANTS } = require("../../../constants/index.js");
// const { userService } = require("../../../services/index.js");
const { userQuery } = require("../../../services/admin/userServices");
const {
  RESPONSE_MESSAGE: { ADMINUSER, FAILEDRESPONSE },
  STATUS_CODE: { SUCCESS, FAILED },
  MAILSUBJECT: { REGISTERMAIL },
} = CONSTANTS;
class AuthController {
  async adminUserCreate(req, res) {
    try {
      const { email, name } = req.body;
      const checkExistingUser = await userQuery({
        email,
        name,
        orQuery: true,
      });
      if (checkExistingUser) {
        throw new Error(ADMINUSER.USERAVAILABLE);
      }
      const { hashedPassword, salt } = await hashSync(
        req.body.password,
        genSaltSync(10)
      );
      const insetObj = {
        ...req.body,
        hashedPassword,
        salt,
      };

      const adminUserSave = new UserSchema(insetObj);
      // const saveResponse = await adminUserSave.save();
      // if (saveResponse) {
      //   const html = `
      // 	Hello ${saveResponse?.name} ,
      // 		Password: ${passwordGenerate}`;

      // Send Confirm Account Email
      // const sendEmail = await sendEmail(
      //   email,
      //   process.env.SENDGRID_EMAIL,
      //   REGISTERMAIL,
      //   html
      // );
      // if (sendEmail[0].statusCode != 202) {
      //   throw new Error("mail is not send");
      // }
      // res.status(200).send({
      //   success: true,
      //   msg: "Admin Created",
      //   data: [],
      // });
      // }
      console.log(adminUserSave);
      res.status(200).send({
        success: true,
        msg: "Admin Created",
        data: [],
      });
    } catch (error) {
      res.status(FAILED).json({
        success: false,
        error: error.message || FAILEDRESPONSE,
      });
    }
  }
  async register(req, res) {
    try {
      let { email } = req.body;
      const emailFind = await UserSchema.findOne({ email });
      if (emailFind) {
        throw new Error("email is already taken");
      } else {
        let holidayList = [
          {
            holidayName: "Makar Sankranti",
            holidayDate: "14/01/2022",
          },
          {
            holidayName: "Republic Day",
            holidayDate: "26/01/2022",
          },
          {
            holidayName: "Holi",
            holidayDate: "18/03/2022",
          },
          {
            holidayName: "Ramzan Eid",
            holidayDate: "03/05/2022",
          },
          {
            holidayName: "Rakshbandhan",
            holidayDate: "11/08/2022",
          },
          {
            holidayName: "Independence Day",
            holidayDate: "15/08/2022",
          },
          {
            holidayName: "Janmashtami",
            holidayDate: "18/08/2022",
          },
          {
            holidayName: "Diwali",
            holidayDate: "24/10/2022",
          },
          {
            holidayName: "New Year",
            holidayDate: "25/10/2022",
          },
          {
            holidayName: "Bhai Dooj",
            holidayDate: "26/10/2022",
          },
          {
            holidayName: "Christmas",
            holidayDate: "25/12/2022",
          },
        ];
        let payload = {
          ...req.body,
          password: hashSync(req.body.password, genSaltSync(10)),
          holidayList: holidayList,
        };

        const user = new UserSchema(payload);
        await user.save();
        return res.status(200).json({ success: true, data: user });
      }
    } catch (error) {
      console.log("error0", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const emailFind = await UserSchema.findOne({ email });
      if (emailFind) {
        const isMatch = compareSync(password, emailFind.password);
        if (isMatch) {
          const token = jwt.sign({ sub: emailFind._id }, secretOrKey, {
            expiresIn: "72h",
          });

          return res.status(200).json({
            success: true,
            message: "login successsfully",
            data: { token, ...emailFind._doc },
          });
        } else {
          throw new Error("email or password is wrong");
        }
      } else {
        throw new Error("email or password is not avalible");
      }
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();
