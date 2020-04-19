import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import Activate from "./auth/activate";
import Private from "./core/private";
import Admin from "./core/admin";
import PrivateRoute from "./auth/private-route";
import AdminRoute from "./auth/admin-route";
import ForgotPassword from "./auth/forgot-password";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/auth/activate/:token" exact component={Activate} />
        <PrivateRoute path="/private" exact component={Private} />
        <AdminRoute path="/admin" exact component={Admin} />
        <Route path="/auth/password/forgot" exact component={ForgotPassword} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
