import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ match }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "#000" };
    } else {
      return { color: "#fff" };
    }
  };

  return (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className="text-light nav-link" style={isActive("/")}>
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/signin"
          className="text-light nav-link"
          style={isActive("/signin")}
        >
          Signin
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/signup"
          className="text-light nav-link"
          style={isActive("/signup")}
        >
          Signup
        </Link>
      </li>
    </ul>
  );
};

export default Navigation;
