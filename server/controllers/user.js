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

exports.update = (request, response) => {
  console.log(
    "UPDATE USER request.user",
    request.user,
    "UPDATE DATA",
    request.body
  );

  const { name, password } = request.body;

  User.findOne({ _id: request.user._id }, (err, user) => {
    if (err || !user) {
      return response.status(400).json({ error: "User not found" });
    }

    if (!name) {
      return response.status(400).json({ error: "Name is required" });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return response
          .status(400)
          .json({ error: "Password should be at least 6 characters" });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        response.status(400).json({ error: "User update failed." });
      }
      updatedUser.hashed_passord = undefined;
      updatedUser.salt = undefined;
      response.json(updatedUser);
    });
  });
};
