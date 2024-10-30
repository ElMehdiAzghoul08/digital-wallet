// apiCalls/requests.js
import { axiosInstance } from ".";

export const GetRequestsByUser = async () => {
  try {
    const { data } = await axiosInstance.get(
      "/api/requests/get-all-requests-by-user"
    );
    return data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error fetching requests",
    };
  }
};

export const SendRequest = async (payload) => {
  try {
    // Log the payload for debugging
    console.log("Sending request payload:", payload);

    const { data } = await axiosInstance.post(
      "/api/requests/send-request",
      payload
    );
    return data;
  } catch (error) {
    console.error("SendRequest error:", error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || "Error sending request",
    };
  }
};

// update request status

export const UpdateRequestStatus = async (request) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/requests/update-request-status",
      request
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
