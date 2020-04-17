const User = require("../models/user");

exports.read = (request, response) => {
  const userId = request.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return response.status(400).json({ error: "User not found" });
    }
    user.hashed_passord = undefined;
    user.salt = undefined;
    response.json(user);
  });
};
