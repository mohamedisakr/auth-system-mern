import React, { useState, useEffect } from "react";
// import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Layout from "../core/layout";

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    // console.log(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const { name, token, show } = values;

  const handleSubmit = (event) => {
    event.preventDefault();
    // setValues({ ...values, buttonText: "Submitting" });
    const config = {
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    };
    axios(config)
      .then((response) => {
        console.log("ACCOUNT ACTIVATION", response);
        setValues({
          ...values,
          show: false,
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("ACCOUNT ACTIVATION ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

  const activateLink = () => (
    <div className="text-center">
      <h2 className="p-5 ">Hi {name}, Ready to activate your account</h2>
      <button className="btn btn-outline-primary" onClick={handleSubmit}>
        Activate Account
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />

        {activateLink()}
      </div>
    </Layout>
  );
};

export default Activate;
