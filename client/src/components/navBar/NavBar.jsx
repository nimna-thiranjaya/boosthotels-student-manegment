import { Button, Space, Dropdown } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useState, useEffect } from "react";
import Logo from "../../assets/Logo.png";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import "./navbar.css";

const NavBar = () => {
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    GetCurrentUser();
  }, []);

  const GetCurrentUser = async () => {
    await axios
      .get("/user/profile")
      .then((res) => {
        setCurrentUser(res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onLogOut = async () => {
    await localStorage.clear();

    window.location.href = "/";
  };

  const items = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => {}}>
          <UserOutlined /> &nbsp;Profile
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={onLogOut}>
          <LogoutOutlined /> &nbsp; Log Out
        </a>
      ),
    },
  ];
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <img src={Logo} className="demo-logo" width="120px" />
      <h2
        style={{
          color: "white",
        }}
      >
        Student Management System
      </h2>

      <div className="username-container">
        <img
          src={currentUser.imageUrl}
          alt="Profile Image"
          className="nav-circle-image"
        />
        &nbsp;&nbsp;
        <Dropdown menu={{ items }} placement="bottomLeft">
          <Button>{currentUser.fullName}</Button>
        </Dropdown>
      </div>
      {/* <Popconfirm
        title="LogOut"
        description="Are you sure to logout?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary">LogOut</Button>
      </Popconfirm> */}
    </Header>
  );
};

export default NavBar;
