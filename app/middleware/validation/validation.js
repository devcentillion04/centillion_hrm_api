const yup = require('yup');

let Validation = yup.object().shape({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    email: yup.string().email()
  });

module.exports = Validation;