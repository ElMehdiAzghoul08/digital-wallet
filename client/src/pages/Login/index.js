import React from "react";
import { Col, Form, Row, message, Button } from "antd"; // Import Button from antd
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../apiCalls/users";

function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await loginUser(values);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="background-primary flex items-center justify-center height-screen">
      <div className="card-1 width-400 p-2 border-radius-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">DIGITALWALLET - LOGIN</h1>
        </div>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Email" name="email">
                <input type="text" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Password" name="password">
                <input type="password" />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary" // You can adjust this if needed
            className="background-primary primary-button-contained width-100 p-2"
            htmlType="submit" // Use Ant Design's htmlType prop for form submission
          >
            Login
          </Button>

          <h1
            className="text-s underline margin-top-2"
            onClick={() => navigate("/register")}
          >
            Register Not a member? Register
          </h1>
        </Form>
      </div>
    </div>
  );
}

export default Login;
