import cookie from "js-cookie";

// set cookie
export const setCookie = (key, value) => {
  if (window !== "undefined") {
    cookie.set(key, value, { expires: 1 });
  }
};

// remove cookie
export const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, { expires: 1 });
  }
};

// get cookie
export const getCookie = (key) => {
  if (window !== "undefined") {
    return cookie.get(key);
  }
};

// set local storage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from local storage
export const removeLocalStorage = (key) => {
  //, value
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// authenticate user by passing data to cookie and local storage during signin
export const authenticate = (response, next) => {
  console.log("Authenticate helper on signin response", response);
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

// access user info from local storage
export const isAuthenticate = () => {
  if (window !== "undefined") {
    const cookie = getCookie("token");
    if (cookie) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const signout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};

export const updateUser = (response, next) => {
  console.log("Update user in local storage helper", response);
  if (typeof window !== "undefined") {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = response.data;
    localStorage.setItem("user", JSON.stringify(auth));
  }
  next();
};
