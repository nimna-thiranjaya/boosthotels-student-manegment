import React, { useState } from "react";
import { Form, Input, Button, Alert, Select, Upload, message } from "antd";
import "./signup.css";
import years from "../../../../data/data";
import { Link } from "react-router-dom";
import axios from "axios";
import ButtonLoading from "../../../../components/customButtonLoading/ButtonLoading";
const { Dragger } = Upload;

const SignUp = () => {
  const [imageFile, setImageFile] = useState();
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [university, setUniversity] = useState();
  const [studyYear, setStudyYear] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "jxd093tt");
    formData.append("cloud_name", "dx1pvvqg7");
    formData.append("folder", "student_profile_images");

    const cloud_name = "dx1pvvqg7";
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.url;
  };

  const onFinish = async () => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    const imageUrl = await uploadImage();
    const body = {
      fullName,
      email,
      university,
      studyYear,
      password,
      imageUrl,
      role: "student",
    };

    if (!password || !confirmPassword) {
      setLoading(false);
      setError("Please Fill All Fields");
      return;
    } else if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      return;
    } else {
      setError(null);
      await axios
        .post("/user/register", body)
        .then((res) => {
          if (res.data) {
            message.success("Successfully registered!");
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          } else {
            setLoading(false);
            setError("Something went wrong!");
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            if (err.response.data.message !== "Data validation error!") {
              setLoading(false);
              setError(err.response.data.message);
            } else {
              setLoading(false);
              setValidationErrors(err.response.data.data);
            }
          } else {
            setLoading(false);
            setError("Something went wrong!");
          }
        });
    }

    console.log(body);
  };
  return (
    <div className="container">
      <div className="signup-card">
        <h1 className="form-title">Student Sign Up</h1>
        <Form className="login-form" onFinish={onFinish}>
          <Form.Item
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <Input
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
              validationErrors={validationErrors.fullName}
            />
            {validationErrors.fullName ? (
              <div className="error-msg">{validationErrors.fullName}</div>
            ) : (
              ""
            )}
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <Input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "calc(100% + 8px)",
              }}
            />
            {validationErrors.email ? (
              <div className="error-msg">{validationErrors.email}</div>
            ) : (
              ""
            )}
          </Form.Item>

          <Form.Item>
            <Input
              placeholder="University Name"
              onChange={(e) => setUniversity(e.target.value)}
            />
            {validationErrors.university ? (
              <div className="error-msg">{validationErrors.university}</div>
            ) : (
              ""
            )}
          </Form.Item>
          <Form.Item>
            <Select
              onChange={(e) => setStudyYear(e)}
              placeholder="Select your year and semester"
            >
              {years.map((year) => (
                <Select.Option value={year.value}>{year.lable}</Select.Option>
              ))}
            </Select>
            {validationErrors.studyYear ? (
              <div className="error-msg">{validationErrors.studyYear}</div>
            ) : (
              ""
            )}
          </Form.Item>
          <Form.Item
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <Input.Password
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <Input.Password
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "calc(100% + 8px)",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Dragger
              listType="picture"
              action={"http://localhost:3000/"}
              showUploadList={{ showRemoveIcon: true }}
              accept=".jpg, .jpeg, .png"
              maxCount={1}
              beforeUpload={(file) => {
                return false;
              }}
              onChange={(e) => {
                setImageFile(e.file);
              }}
            >
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
            {validationErrors.imageUrl ? (
              <div className="error-msg">{validationErrors.imageUrl}</div>
            ) : (
              ""
            )}
          </Form.Item>

          {error ? (
            <Form.Item>
              <Alert message={error} type="error" showIcon />
            </Form.Item>
          ) : (
            ""
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {loading ? <ButtonLoading size={20} /> : "Sign Up"}
            </Button>
          </Form.Item>
          <div className="sign-up-msg">
            Do you have account already? &nbsp; <Link to="/">Login now!</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
