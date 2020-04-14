const { validationResult } = require("express-validator");

exports.runValidation = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ error: errors.array()[0].msg });
  }
  next();
};
