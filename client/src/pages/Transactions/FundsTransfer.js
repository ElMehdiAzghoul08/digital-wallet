import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { TransferFunds, VerifyAccount } from "../../apiCalls/transactions";
import { showLoading, HideLoading } from "../../redux/loaderSlice";
import { ReloadUser } from "../../redux/userSlice";

function FundsTransfer({ showTransferFund, setShowTransferFund, reloadData }) {
  const { user } = useSelector((state) => state.user);
  const [isVerified, setIsVerified] = useState("");
  const [isHoverVerify, setIsHoverVerify] = useState(false); // State for hover effect
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const payload = {
        ...values,
        sender: user._id,
        reference: values.reference || "no reference",
        status: "success",
      };
      const response = await TransferFunds(payload);
      if (response.success) {
        setShowTransferFund(false);
        reloadData();
        dispatch(ReloadUser(true)); // Trigger reload of user data
        message.success(response.message);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const verifyAccount = async () => {
    try {
      dispatch(showLoading());
      const receiverAccount = form.getFieldValue("receiver");
      const response = await VerifyAccount({
        receiver: receiverAccount,
      });
      dispatch(HideLoading());
      setIsVerified(response.success ? "true" : "false");
    } catch (error) {
      dispatch(HideLoading());
      setIsVerified("false");
    }
  };

  // Define separate button styles
  const cancelButtonStyle = {
    backgroundColor: "#f0f0f0", // Original color (adjust if needed)
    color: "#000", // Black text for visibility
    borderColor: "#f0f0f0",
    height: "50px",
    width: "150px",
    fontSize: "15px",
    borderRadius: "5px",
    cursor: "pointer", // Change cursor on hover
  };

  const transferButtonStyle = {
    backgroundColor: "#037dd6",
    color: "#fff",
    borderColor: "#037dd6",
    height: "50px",
    width: "150px",
    fontSize: "15px",
    borderRadius: "5px",
    cursor: "pointer", // Change cursor on hover
  };

  const verifyButtonStyle = {
    backgroundColor: isHoverVerify ? "#007bb5" : "#037dd6", // Change on hover
    color: "#fff",
    borderColor: "#037dd6",
    height: "50px",
    width: "150px",
    fontSize: "15px",
    borderRadius: "5px",
    cursor: "pointer", // Change cursor on hover
  };

  return (
    <div>
      <Modal
        title="Transfer Funds"
        open={showTransferFund}
        onCancel={() => setShowTransferFund(false)}
        onClose={() => setShowTransferFund(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <div className="flex gap-2 items-center">
            <Form.Item
              label="Account Number"
              name="receiver"
              className="width-100"
            >
              <input type="text" />
            </Form.Item>
            <button
              style={verifyButtonStyle} // Apply verify button style
              type="button"
              onClick={verifyAccount}
              onMouseEnter={() => setIsHoverVerify(true)} // Mouse hover in
              onMouseLeave={() => setIsHoverVerify(false)} // Mouse hover out
            >
              VERIFY
            </button>
          </div>
          {isVerified === "true" && (
            <div className="success-background">
              Account successfully verified
            </div>
          )}

          {isVerified === "false" && (
            <div className="error-background">Invalid Account</div>
          )}

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please enter the amount to transfer",
              },
              {
                max: user.balance,
                message: "Balance Insufficient",
              },
              {
                min: 1,
                message: "Amount must be greater than or equal to 1",
              },
            ]}
          >
            <input type="number" max={user.balance} />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <textarea type="text" />
          </Form.Item>

          <div className="flex justify-end gap-1">
            <button
              style={cancelButtonStyle} // Apply cancel button style
              type="button"
              onClick={() => setShowTransferFund(false)}
            >
              Cancel
            </button>
            {isVerified === "true" && (
              <button style={transferButtonStyle} type="submit">
                Transfer
              </button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default FundsTransfer;
