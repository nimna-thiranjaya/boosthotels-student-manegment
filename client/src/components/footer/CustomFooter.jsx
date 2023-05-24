import { Footer } from "antd/es/layout/layout";
import React from "react";

const CustomFooter = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        position: "absolute",
        bottom: "0",
        width: "100%",
      }}
    >
      CopyRight ©2023 Created by Boost Hotels
    </Footer>
  );
};

export default CustomFooter;
