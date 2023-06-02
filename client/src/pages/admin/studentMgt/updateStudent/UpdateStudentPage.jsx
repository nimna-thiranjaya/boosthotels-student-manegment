import React, { useState, useEffect } from "react";
import NavBar from "../../../../components/navBar/NavBar";
import CustomFooter from "../../../../components/footer/CustomFooter";
import "./updatestudent.css";
import { Row, Col, Input, Form, Button, Select, message } from "antd";
import years from "../../../../data/data";
import { useParams } from "react-router-dom";
import axios from "axios";
import ButtonLoading from "../../../../components/customButtonLoading/ButtonLoading";

const UpdateStudentPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    GetUserDetails();
  }, []);

  const GetUserDetails = async () => {
    try {
      const res = await axios.get(`/user/getStudentById/${id}`);
      setStudent(res.data.student);
      setFullName(res.data.student.fullName);
      setEmail(res.data.student.email);
      setUniversity(res.data.student.university);
      setStudyYear(res.data.student.studyYear);
      setImageUrl(res.data.student.imageUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const onUpdate = async () => {
    setLoading(true);
    try {
      const newObj = student;
      newObj.fullName = fullName;
      newObj.university = university;
      newObj.studyYear = studyYear;

      const res = await axios.patch(`/user/updateUser/${id}`, newObj);
      if (res.data) {
        message.success("Student updated successfully");
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/studentMgt";
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };
  return (
    <div className="update-student-page">
      <NavBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          marginTop: "30px",
        }}
      >
        <div className="signup-card">
          <div className="signup-card-header">
            <h2>Update Student</h2>
            <hr />
          </div>
          <Form span={24} onFinish={onUpdate}>
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
                  <Input
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <Input placeholder="Email" value={email} disabled />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Row>
                <Col span={24}>
                  <Input
                    placeholder="University Name"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Row>
                <Col span={24}>
                  <Select
                    placeholder="Select your year and semester"
                    value={studyYear}
                    onChange={(value) => setStudyYear(value)}
                  >
                    {years.map((year) => (
                      <Select.Option value={year.value}>
                        {year.lable}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                {loading ? <ButtonLoading size={20} /> : "Update Student"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <CustomFooter />
    </div>
  );
};

export default UpdateStudentPage;
