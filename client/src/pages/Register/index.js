import React from "react";
import { Col, Form, Row, message, Button } from "antd"; // Import Button from antd
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../apiCalls/users";

function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await registerUser(values);
      if (response.success) {
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="m-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">DIGITALWALLET - REGISTER</h1>

        <h1 className="text-s underline" onClick={() => navigate("/login")}>
          Already a member? Login
        </h1>
      </div>
      <hr />
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={15}>
          <Col span={6}>
            <Form.Item label="First Name" name="firstName">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Last Name" name="lastName">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Phone Number" name="phoneNumber">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Email" name="email">
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Identification Type"
              name="identificationType"
              required={false}
            >
              <select>
                <option value="" disabled selected>
                  Choose ID Type
                </option>
                <option value="NATIONAL ID">National ID</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVING LICENSE">Driving License</option>
                <option value="SOCIAL CARD">Social Security Card (SSN)</option>
              </select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Identification Number"
              name="identificationNumber"
            >
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Address" name="address">
              <textarea type="text" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Password" name="password">
              <input type="password" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Confirm Password" name="confirmPassword">
              <input type="password" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            className="primary-button-contained"
            style={{
              backgroundColor: "#0A2540",
              color: "#fff",
              borderColor: "#0A2540",
              height: "50px",
              width: "150px",
              fontSize: "15px", // Keep the button's existing color
            }}
          >
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Register;
