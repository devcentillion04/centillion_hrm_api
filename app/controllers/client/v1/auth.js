const { UserSchema } = require("../../../models/user");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
let secretOrKey = process.env.JWT_SECRET;
class AuthController {
  async register(req, res) {
    try {
      let {email} = req.body;
      const emailFind = await UserSchema.findOne({email})
      if(emailFind){
        throw new Error("email is already taken");
      }else{
      let payload = {
        ...req.body,
        password: hashSync(req.body.password, genSaltSync(10)),
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
