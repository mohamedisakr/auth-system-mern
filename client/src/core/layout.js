import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticate } from "../auth/helpers";
// import Navigation from "./navigation";

const Layout = ({ children, history }) => {
  //, match
  // const isActive = (path) => {
  //   if (match.path === path) {
  //     return { color: "#000" };
  //   } else {
  //     return { color: "#fff" };
  //   }
  // };

  // style={isActive("/")} , style={isActive("/signin")}, style={isActive("/signup")}
  const nav = () => (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </li>
      {!isAuthenticate() && (
        <Fragment>
          <li className="nav-item">
            <Link to="/signin" className="nav-link">
              Signin
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link">
              Signup
            </Link>
          </li>
        </Fragment>
      )}
      {isAuthenticate() && isAuthenticate().role === "admin" && (
        <li className="nav-item">
          <Link to="/admin" className="nav-link">
            {isAuthenticate().name}
          </Link>
        </li>
      )}
      {isAuthenticate() && isAuthenticate().role === "subscriber" && (
        <li className="nav-item">
          <Link to="/private" className="nav-link">
            {isAuthenticate().name}
          </Link>
        </li>
      )}
      {isAuthenticate() && (
        <li className="nav-item">
          <span
            className="nav-link"
            style={{ cursor: "pointer", color: "#fff" }}
            onClick={() => {
              signout(() => {
                history.pushState("/");
              });
            }}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      {/* <Navigation /> */}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);
