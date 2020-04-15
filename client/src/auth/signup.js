import React, { useState } from "react";
// import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Layout from "../core/layout";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { name, email, password, buttonText } = values;

  // curry function to handle input change events
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    const config = {
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    };
    axios(config)
      .then((response) => {
        console.log("SIGNUP SUCCESS", response);
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          buttonText: "Submitted",
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("SIGNUP ERROR", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const signupForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name:</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
        />
      </div>
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
        {JSON.stringify({ name, email, password })}
        <h2 className="p-5 text-center">Signup</h2>
        {signupForm()}
      </div>
    </Layout>
  );
};

export default Signup;
