import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import UserLogin from "./pages/user/auth/UserLogin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
