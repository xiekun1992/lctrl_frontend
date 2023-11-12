import { Card, Skeleton, Avatar } from "antd";
import React, { useState, useEffect } from "react";
import laptopIcon from "../images/ico2068.ico";

const DeviceDetail = () => {
  const [self, setSelf] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/device")
      .then((res) => res.json())
      .then((_self) => {
        setSelf(_self);
      });
  }, []);

  return (
    <Card
      style={{ width: "100%", border: "none" }}
      actions={
        [
          // <SettingOutlined key="setting" />,
          // <EditOutlined key="edit" />,
          // <EllipsisOutlined key="ellipsis" />,
        ]
      }
    >
      <Skeleton loading={false} avatar active>
        <Card.Meta
          avatar={<Avatar shape="square" size={64} src={laptopIcon} />}
          title={<span>{self.hostname}</span>}
          description={
            <div>
              {self.ifs?.map((item) => {
                return (
                  <div key={item.mac_addr}>
                    <div>{item.addr}</div>
                    <div>{item.netmask}</div>
                    <div>{item.broadcast_addr}</div>
                    <div>{item.mac_addr}</div>
                  </div>
                );
              })}
            </div>
          }
        />
      </Skeleton>
    </Card>
  );
};
export default DeviceDetail;
