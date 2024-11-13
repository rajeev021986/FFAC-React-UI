import { createSlice } from "@reduxjs/toolkit";

// Load user data from local storage if it exists
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialState = {
  isAuthenticated: storedUser && storedToken ? true : false,
  user: storedUser || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user,authtype } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      localStorage.setItem("token", token);
      localStorage.setItem("authtype",authtype);
      localStorage.setItem("user", JSON.stringify({
        ...user,
        // set token expiration time : 5 days
        expiresIn: new Date().getTime() + 1000 * 60 * 60 * 24 * 5
      })); 
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user"); 
      localStorage.removeItem("authtype");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;