import React from "react";
import { ConfigProvider, theme } from "antd";

const { darkAlgorithm } = theme;

const withTheme = (node: JSX.Element) => (
  <>
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
      }}
    >
      {node}
    </ConfigProvider>
  </>
);

export default withTheme;
