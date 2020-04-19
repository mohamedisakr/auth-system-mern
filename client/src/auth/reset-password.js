import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../core/layout";
import "react-toastify/dist/ReactToastify.min.css";
import { Redirect } from "react-router-dom";

const ResetPassword = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset password",
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const { name, token, newPassword, buttonText } = values;

  // curry function to handle input change events
  const handleChange = (event) => {
    setValues({ ...values, newPassword: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    const config = {
      method: "PUT",
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { newPassword, ResetPasswordLink: token },
    };
    axios(config)
      .then((response) => {
        console.log("RESET PASSWORD SUCCESS", response);
        setValues({ ...values, buttonText: "Done" });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("RESET PASSWORD ERROR", error.response.data);
        toast.error(error.response.data.error);
        setValues({ ...values, buttonText: "Reset password" });
      });
  };

  const passwordResetForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">New Password:</label>
        <input
          onChange={handleChange}
          value={newPassword}
          type="password"
          placeholder="Type new password"
          className="form-control"
          required
        />
      </div>
      <div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h2 className="p-5 text-center">Hi {name}, Type your new password</h2>
        {passwordResetForm()}
      </div>
    </Layout>
  );
};

export default ResetPassword;
