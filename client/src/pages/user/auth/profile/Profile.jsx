import React, { useState, useEffect } from "react";
import UserNavBar from "../../../../components/navBar/userNavBar/UserNavbar";
import "./profile.css";
import { Button, Col, Form, Input, Popconfirm, Row, message } from "antd";
import axios from "axios";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    GetUserDetails();
  }, []);

  const GetUserDetails = async () => {
    try {
      await axios
        .get("/user/profile")
        .then((res) => {
          setCurrentUser(res.data.user);
          setFullName(res.data.user.fullName);
          setEmail(res.data.user.email);
          setUniversity(res.data.user.university);
          setStudyYear(res.data.user.studyYear);
          setImageUrl(res.data.user.imageUrl);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    try {
      await axios
        .delete(`/user/deleteProfile`)
        .then((res) => {
          if (res.data) {
            message.success("User deleted successfully");
            setTimeout(() => {
              localStorage.clear();
              window.location.href = "/";
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <UserNavBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="signup-card">
          <Form span={24}>
            <Form.Item
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={imageUrl} alt="Avatar" className="avatar" />
            </Form.Item>
            <Form.Item>
              <Row>
                <Col span={11}>
                  <Input placeholder="Full Name" value={fullName} />
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <Input placeholder="Email" value={email} />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Row>
                <Col span={24}>
                  <Input placeholder="University Name" value={university} />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Row>
                <Col span={24}>
                  <Input placeholder="University Name" value={studyYear} />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <Row>
                <Col span={24}>
                  <Popconfirm
                    title="Delete Confirmation"
                    description="Are you sure, You want to delete your account?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={onDelete}
                    onCancel={() => {}}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                      danger
                    >
                      Delete Profile
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
