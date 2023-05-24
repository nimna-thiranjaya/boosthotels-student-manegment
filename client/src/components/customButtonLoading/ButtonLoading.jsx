import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const ButtonLoading = (props) => {
  const size = props.size || 24;
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: size,
        color: "white",
      }}
      spin
    />
  );

  return <Spin indicator={antIcon} />;
};

export default ButtonLoading;
