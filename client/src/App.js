import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import UserLogin from "./pages/user/auth/login/UserLogin";
import SignUp from "./pages/user/auth/signup/SignUp";
import StudentMgt from "./pages/admin/studentMgt/StudentMgt";
import axios from "axios";
import CONSTANTS from "./constants";
import Profile from "./pages/user/auth/profile/Profile";
import UpdateStudentPage from "./pages/admin/studentMgt/updateStudent/UpdateStudentPage";

const App = () => {
  const [role, setRole] = useState(null);
  axios.defaults.baseURL = CONSTANTS.API.BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    const role = localStorage.getItem("role");
    if (role) {
      setRole(role);
    }
  }, []);
  return (
    <BrowserRouter>
      {role && role === "admin" ? (
        <Routes>
          <Route path="/studentMgt" element={<StudentMgt />} />
          <Route path="/studentUpdate/:id" element={<UpdateStudentPage />} />
        </Routes>
      ) : role && role === "student" ? (
        <Routes>
          <Route path="/studentProfile" element={<Profile />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<UserLogin />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
