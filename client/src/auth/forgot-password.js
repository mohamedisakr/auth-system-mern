import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../core/layout";
import "react-toastify/dist/ReactToastify.min.css";
import { Redirect } from "react-router-dom";

const ForgotPassword = ({ history }) => {
  const [values, setValues] = useState({
    email: "",
    buttonText: "Request password reset link",
  });

  const { email, buttonText } = values;

  // curry function to handle input change events
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    const config = {
      method: "PUT",
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email },
    };
    axios(config)
      .then((response) => {
        console.log("FORGOT PASSWORD SUCCESS", response);
        setValues({ ...values, buttonText: "Requested" });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("FORGOT PASSWORD ERROR", error.response.data);
        toast.error(error.response.data.error);
        setValues({ ...values, buttonText: "Request password reset link" });
      });
  };

  const passwordForgotForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email:</label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control"
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
        <h2 className="p-5 text-center">Forgot Password</h2>
        {passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
