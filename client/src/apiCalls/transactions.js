import FundsTransfer from "../pages/Transactions/FundsTransfer";

const { axiosInstance } = require(".");

// verify receiver account

export const VerifyAccount = async (payload) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/transactions/verify-account",
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
// transfer funds between accounts
export const TransferFunds = async (payload) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/transactions/transfer-fund",
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// get all transactions for a user account

export const GetTransactionsUser = async () => {
  try {
    const { data } = await axiosInstance.post(
      "/api/transactions/get-all-transactions-by-user"
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
