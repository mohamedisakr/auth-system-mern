const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const sendgridMail = require("@sendgrid/mail");
var _ = require("lodash");

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

// Signup user WITH email confirmation
exports.signup = (request, response) => {
  const { name, email, password } = request.body;
  // check if the user's email already exist in the database
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      response.status(400).json({ error: "Email is already exist." });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation confirmation`,
      html: `
              <h3>Please use the following link to activate your account</h3>
              <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
              <hr/>
              <p>This email may contain sensetive information</p>
              <p>${process.env.CLIENT_URL}</p>
            `,
    };

    sendgridMail
      .send(emailData)
      .then((sent) => {
        console.log("Signup email sent", sent);
        return response.json({
          message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
        });
      })
      .catch((err) =>
        response.json({ message: `Could not get any response, ${err.message}` })
      );
  });
};

exports.accountActivation = (request, response) => {
  const { token } = request.body;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
      err,
      decoded
    ) {
      if (err) {
        console.log("JWT verify in account activation error", err);
        return response
          .status(401)
          .json({ error: "Expired link. Please signup again" });
      }

      const { name, email, password } = jwt.decode(token);

      const user = new User({ name, email, password });

      user.save((err, user) => {
        if (err) {
          console.log("Save user in account activation error", err);
          return response
            .status(401)
            .json({ error: "Error saving user in database. Try signup again" });
        }

        return response.json({ message: "Signup success. Please signin" });
      });
    });
  } else {
    return response.json({ message: "Something went wrong. Try again" });
  }
};

exports.signin = (request, response) => {
  const { email, password } = request.body;

  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return response
        .status(400)
        .json({ error: "User with this email does not exist. Please signup" });
    }

    // authenticate
    if (!user.authenticate(password)) {
      return response
        .status(400)
        .json({ error: "Email and password do not match" });
    }

    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, email, role } = user;

    return response.json({ token, user: { _id, name, email, role } });
  });
};

exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET });

exports.adminMiddleware = (request, response, next) => {
  User.findById({ _id: request.user._id }).exec((err, user) => {
    if (err || !user) {
      return response.status(400).json({ error: "User not found" });
    }

    if (user.role !== "admin") {
      return response
        .status(400)
        .json({ error: "Admin resource. Access denied" });
    }

    request.profile = user;
    next();
  });
};

exports.forgotPassword = (request, response) => {
  const { email } = request.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return response
        .status(400)
        .json({ error: "User with this email does not exist" });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password reset confirmation`,
      html: `
              <h3>Please use the following link to reset your password</h3>
              <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
              <hr/>
              <p>This email may contain sensetive information</p>
              <p>${process.env.CLIENT_URL}</p>
            `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
        return response.status(400).json({
          error: "Database connection error on user password forgot request",
        });
      } else {
        sendgridMail
          .send(emailData)
          .then((sent) => {
            console.log("Signup email sent", sent);
            return response.json({
              message: `Email has been sent to ${email}. Follow the instruction to reset your password`,
            });
          })
          .catch((err) =>
            response.json({
              message: `Could not get any response, ${err.message}`,
            })
          );
      }
    });
  });
};

exports.resetPassword = (request, response) => {
  const { resetPasswordLink, newPassword } = request.body;
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, decoded) => {
        if (err) {
          return response.status(400).json({
            error: "Expired link. Try again",
          });
        }

        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return response
              .status(400)
              .json({ error: "Something went wrong. Try later" });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return response
                .status(400)
                .json({ error: "Error resetting user password" });
            }
            response.json({
              message: `Greet now you can login with your new password`,
            });
          });
        });
      }
    );
  }
};
