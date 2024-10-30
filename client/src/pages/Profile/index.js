import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser } from "../../redux/userSlice";
import { Form, Input, message } from "antd";
import PageTitle from "../../components/PageTitles";
import { axiosInstance } from "../../apiCalls";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isHoverUpdate, setIsHoverUpdate] = useState(false); // State for hover effect

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/users/update-profile", {
        ...values,
        userId: user._id,
      });
      setLoading(false);
      if (response.data.success) {
        message.success(response.data.message);
        dispatch(UpdateUser(response.data.data));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  // Update button style
  const updateButtonStyle = {
    backgroundColor: isHoverUpdate ? "#007bb5" : "#037dd6", // Change on hover
    color: "#fff",
    borderColor: "#037dd6",
    height: "50px",
    width: "150px",
    fontSize: "15px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div className="m-5">
      <PageTitle title="Profile" />
      <div className="card-1 mt-4 border-radius-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <i className="ri-shield-user-line text-2xl"></i>
            <h1 className="text-2xl margin-top-2">Personal Information</h1>
          </div>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={user}
          className="mt-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true }]}
              className="md:col-span-2"
            >
              <Input.TextArea rows={3} disabled />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              style={updateButtonStyle} // Apply update button style
              type="submit"
              disabled={loading}
              onMouseEnter={() => setIsHoverUpdate(true)} // Hover in
              onMouseLeave={() => setIsHoverUpdate(false)} // Hover out
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
