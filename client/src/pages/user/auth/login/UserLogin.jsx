import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Checkbox, Popconfirm } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import ButtonLoading from "../../../../components/customButtonLoading/ButtonLoading";

const UserLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") {
        window.location.href = "/studentMgt";
      } else {
        window.location.href = "/studentProfile";
      }
    }
  }, []);

  const onFinish = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });
      if (response.data) {
        if (response.data.role === "admin") {
          await localStorage.setItem("token", response.data.token);
          await localStorage.setItem("role", response.data.role);
          window.location.href = "/studentMgt";
        } else if (response.data.role === "student") {
          await localStorage.setItem("token", response.data.token);
          await localStorage.setItem("role", response.data.role);
          window.location.href = "/studentProfile";
        }
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
    setLoading(false);
  };
  return (
    <div className="container">
      <div className="form-card">
        <h1 className="form-title">Student Login</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          {error && (
            <Form.Item>
              {<Alert message={error} type="error" showIcon />}
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {loading ? <ButtonLoading size={18} /> : "Log in"}
            </Button>
          </Form.Item>
          <div className="sign-up-msg">
            Don't have an account? &nbsp;{" "}
            <Link to="/signUp">Register now!</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserLogin;
