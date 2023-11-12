import { Flex } from "antd";
import DeviceDetail from "./DeviceDetail";

const ControlPane = () => {
  return (
    <Flex
      style={{
        height: "100vh",
        width: "calc(100vw - 400px)",
      }}
      justify="center"
      align="center"
    >
      <DeviceDetail />
    </Flex>
  );
};
export default ControlPane;
