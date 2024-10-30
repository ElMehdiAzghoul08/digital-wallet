const { axiosInstance } = require(".");

// user login
export const loginUser = async (payload) => {
  try {
    const { data } = await axiosInstance.post("/api/users/login", payload);
    if (data.success) {
      localStorage.setItem("token", data.data);
    }
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// user registration

export const registerUser = async (payload) => {
  try {
    const { data } = await axiosInstance.post("/api/users/register", payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// get user information

export const getUserInfo = async () => {
  try {
    const { data } = await axiosInstance.post("/api/users/get-user-info");

    return data;
  } catch (error) {
    return error.response.data;
  }
};

// get all users

export const getAllUsers = async () => {
  try {
    const { data } = await axiosInstance.get("/api/users/get-all-users");
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// update users verification status

export const updateVerificationStatus = async (payload) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/users/update-verification-status",
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateProfile = async (payload) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/users/update-profile",
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
