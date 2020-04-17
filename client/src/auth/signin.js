import React, { useState } from "react";
// import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../core/layout";
import { authenticate, isAuthenticate } from "./helpers";
import "react-toastify/dist/ReactToastify.min.css";
import { Redirect } from "react-router-dom";

const Signin = ({ history }) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { email, password, buttonText } = values;

  // curry function to handle input change events
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    const config = {
      method: "POST",
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    };
    axios(config)
      .then((response) => {
        console.log("SIGNIN SUCCESS", response);
        // save the response, user ==>> local storage /  token ==>> cookie
        authenticate(response, () => {
          setValues({
            ...values,
            email: "",
            password: "",
            buttonText: "Submitted",
          });
          // toast.success(`Hi ${response.data.user.name}, welcome back!`);
          isAuthenticate() && isAuthenticate().role === "admin"
            ? history.push("/admin")
            : history.push("/private");
        });
      })
      .catch((error) => {
        console.log("SIGNIN ERROR", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const signinForm = () => (
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
      <div className="form-group">
        <label className="text-muted">Password:</label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="password"
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
        {isAuthenticate() ? <Redirect to="/" /> : null}
        <h2 className="p-5 text-center">Signin</h2>
        {signinForm()}
      </div>
    </Layout>
  );
};

export default Signin;
