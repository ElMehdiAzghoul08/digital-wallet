// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import loaderReducer from "./loaderSlice"; // Assuming you have a loaderSlice

const store = configureStore({
  reducer: {
    user: userReducer,
    loaders: loaderReducer, // Ensure this is included
  },
});

export default store;
