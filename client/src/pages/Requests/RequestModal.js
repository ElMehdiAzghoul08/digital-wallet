import React from "react";
import { Modal, Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { VerifyAccount } from "../../apiCalls/transactions";
import { showLoading, HideLoading } from "../../redux/loaderSlice";
import { SendRequest } from "../../apiCalls/requests";

function RequestModal({ showRequestModal, setShowRequestModal, reloadData }) {
  const { user } = useSelector((state) => state.user);
  const [isVerified, setIsVerified] = React.useState("");
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      if (!values.receiver || !values.amount || !values.description) {
        message.error("Please fill in all required fields");
        return;
      }

      dispatch(showLoading());
      const payload = {
        receiver: values.receiver,
        amount: Number(values.amount),
        description: values.description,
      };

      const response = await SendRequest(payload);

      if (response.success) {
        setShowRequestModal(false);
        if (reloadData) reloadData();
        message.success(response.message);
        form.resetFields();
      } else {
        message.error(response.message || "Failed to send request");
      }
    } catch (error) {
      message.error(error.message || "Error sending request");
    } finally {
      dispatch(HideLoading());
    }
  };

  const verifyAccount = async () => {
    try {
      const receiverAccount = form.getFieldValue("receiver");
      if (!receiverAccount) {
        message.warning("Please enter an account number");
        return;
      }

      dispatch(showLoading());
      const response = await VerifyAccount({ receiver: receiverAccount });

      setIsVerified(response.success ? "true" : "false");
      response.success
        ? message.success("Account verified successfully")
        : message.error(response.message || "Invalid account");
    } catch (error) {
      setIsVerified("false");
      message.error(error.message || "Error verifying account");
    } finally {
      dispatch(HideLoading());
    }
  };

  // Define consistent button styles
  const cancelButtonStyle = {
    backgroundColor: "#f0f0f0",
    color: "#000",
    borderColor: "#f0f0f0",
    height: "50px",
    width: "150px",
    fontSize: "15px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const requestButtonStyle = {
    backgroundColor: "#037dd6",
    color: "#fff",
    borderColor: "#037dd6",
    height: "50px",
    width: "150px",
    fontSize: "15px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const verifyButtonStyle = {
    backgroundColor: "#037dd6",
    color: "#fff",
    borderColor: "#037dd6",
    height: "50px",
    width: "150px",
    fontSize: "15px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <Modal
      title="Request Funds"
      open={showRequestModal}
      onCancel={() => setShowRequestModal(false)}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          amount: "",
          description: "",
        }}
      >
        <div className="flex gap-2 items-center">
          <Form.Item
            label="Account Number"
            name="receiver"
            className="w-full"
            rules={[
              { required: true, message: "Please enter account number" },
              { whitespace: true, message: "Account number cannot be empty" },
            ]}
          >
            <input type="text" className="w-full p-2 border rounded" />
          </Form.Item>
          <button
            type="button"
            onClick={verifyAccount}
            style={verifyButtonStyle} // Apply verify button style
          >
            Verify
          </button>
        </div>

        {isVerified === "true" && (
          <div className="success-background p-2 mb-4 rounded">
            Account verified successfully
          </div>
        )}

        {isVerified === "false" && (
          <div className="error-background p-2 mb-4 rounded">
            Invalid Account
          </div>
        )}

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please enter amount" },
            {
              validator: async (_, value) => {
                if (!value) throw new Error("Amount is required");
                const numberValue = Number(value);
                if (isNaN(numberValue))
                  throw new Error("Please enter a valid number");
                if (numberValue <= 0)
                  throw new Error("Amount must be greater than 0");
                return Promise.resolve();
              },
            },
          ]}
        >
          <input
            type="number"
            min="0.01"
            step="0.01"
            className="w-full p-2 border rounded"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter description" },
            { whitespace: true, message: "Description cannot be empty" },
          ]}
        >
          <textarea className="w-full p-2 border rounded" rows={4} />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowRequestModal(false)}
            style={cancelButtonStyle} // Apply cancel button style
          >
            Cancel
          </button>
          {isVerified === "true" && (
            <button
              type="submit"
              style={requestButtonStyle} // Apply request button style
            >
              Request
            </button>
          )}
        </div>
      </Form>
    </Modal>
  );
}

export default RequestModal;
