import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  isAuthenticate,
  getCookie,
  signout,
  updateUser,
} from "../auth/helpers";
import Layout from "../core/layout";
import "react-toastify/dist/ReactToastify.min.css";

const Admin = ({ history }) => {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const config = {
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuthenticate()._id}`,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        console.log("PROFILE UPDATE", response);
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch((error) => {
        console.log("ADMIN PROFILE UPDATE ERROR", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => history.push("/"));
        }
      });
  };

  const { role, name, email, password, buttonText } = values;

  // curry function to handle input change events
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    const config = {
      method: "PUT",
      url: `${process.env.REACT_APP_API}/admin/update`,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
      data: { name, password },
    };
    axios(config)
      .then((response) => {
        console.log("ADMIN PROFILE UPDATE SUCCESS", response);
        updateUser(response, () => {
          setValues({ ...values, buttonText: "Submitted" });
          toast.success("Profile updated successfully");
        });
      })
      .catch((error) => {
        console.log("ADMIN PROFILE UPDATE ERROR", error.response.data.error);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const updateForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Role:</label>
        <input
          defaultValue={role}
          type="text"
          className="form-control"
          disabled
        />
      </div>
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
          defaultValue={email}
          type="email"
          className="form-control"
          disabled
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
        <h2 className="pt-5 text-center">Admin</h2>
        <p className="lead text-center">Profile Update</p>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Admin;
