const yup = require("yup");

const login = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter valid email address"),
  password: yup.string().required("Password is required"),
});
const register = yup.object().shape({
  firstname: yup.string().required("Firstname is Required"),
  lastname: yup.string().required("Lastname is Required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password minimum 6 character is required"),
  mobileno: yup
    .number()
    .min(10, "Minimum 10 digit Required")
    .required("Mobile number required"),
});

module.exports = {
  login,
  register,
};
