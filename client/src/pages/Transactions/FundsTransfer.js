import React from "react";
import { Modal, Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { TransferFunds, VerifyAccount } from "../../apiCalls/transactions";
import { showLoading, HideLoading } from "../../redux/loaderSlice";
function FundsTransfer({ showTransferFund, setShowTransferFund, reloadData }) {
  const { user } = useSelector((state) => state.user);
  const [isVerified, setisVerified] = React.useState("");
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
      console.log("Verifying account:", receiverAccount);
      const response = await VerifyAccount({
        receiver: receiverAccount,
      });
      dispatch(HideLoading());
      console.log("API response:", response);
      if (response.success) {
        setisVerified("true");
      } else {
        setisVerified("false");
      }
    } catch (error) {
      dispatch(HideLoading());
      console.error("Error verifying account:", error);
      setisVerified("false");
    }
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
              className="primary-button-contained .margin-top-1"
              type="button"
              onClick={verifyAccount}
            >
              VERIFY
            </button>
          </div>
          {isVerified === "true" && (
            <div className="success-background">
              Account successfully verification
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
            <input type="Number" max={user.balance} />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <textarea type="text" />
          </Form.Item>

          <div className="flex justify-end gap-1">
            <button className="primary-button-outlined">Cancel</button>
            {isVerified === "true" && (
              <button className="primary-button-contained">Transfer</button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default FundsTransfer;
