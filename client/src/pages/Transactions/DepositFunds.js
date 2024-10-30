import React, { useState } from "react";
import { Form, message, Modal } from "antd";
import StripeCheckout from "react-stripe-checkout";
import { HideLoading, showLoading } from "../../redux/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { DepositFunds as depositFundsApi } from "../../apiCalls/transactions";
import { ReloadUser } from "../../redux/userSlice";

function DepositFunds({ showDepositFunds, setShowDepositFunds, reloadData }) {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const onToken = async (token) => {
    try {
      dispatch(showLoading());
      const response = await depositFundsApi({
        token,
        amount: form.getFieldValue("amount"),
        userId: user._id,
      });
      if (response.success) {
        reloadData();
        setShowDepositFunds(false);
        message.success("Funds deposited successfully");
        dispatch(ReloadUser(true)); // Trigger reload of user data
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  // Define separate button styles
  const cancelButtonStyle = {
    backgroundColor: "#f0f0f0", // Original color (adjust if needed)
    color: "#000", // Black text for visibility
    borderColor: "#f0f0f0",
    height: "50px",
    width: "150px",
    fontSize: "15px",
    borderRadius: "5px", // Optional: to make corners rounder
    cursor: "pointer", // Change cursor on hover
  };

  const depositButtonStyle = {
    backgroundColor: "#037dd6",
    color: "#fff",
    borderColor: "#037dd6",
    height: "50px",
    width: "150px",
    fontSize: "15px",
    borderRadius: "5px", // Optional: to make corners rounder
    cursor: "pointer", // Change cursor on hover
  };

  return (
    <Modal
      title="Deposit"
      open={showDepositFunds}
      onCancel={() => setShowDepositFunds(false)}
      footer={null}
    >
      <div className="flex-col gap-1">
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input amount!",
              },
            ]}
          >
            <input type="number" onChange={handleAmountChange} />
          </Form.Item>
          <div className="flex gap-1 justify-end">
            <button
              style={cancelButtonStyle} // Apply cancel button style
              onClick={() => setShowDepositFunds(false)}
              type="button"
            >
              Cancel
            </button>
            <StripeCheckout
              token={onToken}
              shippingAddress
              amount={amount * 100}
              currency="USD"
              stripeKey="pk_test_51QCmOVBMs951lw4AhF0nmGwP9mUA7v2g353mFJL5vEhphxhlYjMPib7IW5a8fm5jfRnOtQUjuX6xachv5OuHDolO00I2eeH5ln"
            >
              <button style={depositButtonStyle} type="button">
                Deposit
              </button>
            </StripeCheckout>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default DepositFunds;
