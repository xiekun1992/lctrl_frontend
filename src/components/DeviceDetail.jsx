import { Card, Skeleton, Switch, Avatar } from "antd";
import React, { useState, useEffect } from "react";
import laptopIcon from "../images/ico2068.ico";
import useStore from "../store/index.ts";

const DeviceDetail = () => {
  const { curDevice, setCurDevice, settings, setSettings, setPrimaryScreen } =
    useStore();

  useEffect(() => {
    fetch("http://127.0.0.1:18000/api/device")
      .then((res) => res.json())
      .then((_self) => {
        setCurDevice(_self);
        setPrimaryScreen(
          _self.screens.map((s) => ({
            x: s.left,
            y: s.top,
            width: s.right - s.left,
            height: s.bottom - s.top,
          }))
        );
      });

    fetch("http://127.0.0.1:18000/api/setting")
      .then((res) => res.json())
      .then((_self) => {
        setSettings({
          autoDiscover: _self.auto_discover,
          screenSetting: _self.screen_setting,
        });
      });
  }, []);

  return (
    <Card
      style={{ width: "100%", border: "none", borderRadius: 0 }}
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
          title={<span>{curDevice.hostname}</span>}
          description={
            <>
              {/* <div>{`${self.screen_size.right - self.screen_size.left} x ${
                self.screen_size.bottom - self.screen_size.top
              }`}</div> */}
              <div style={{ display: "flex", gap: 20 }}>
                {curDevice.ifs?.map((item) => {
                  return (
                    <div key={item.mac_addr} style={{ marginBottom: 10 }}>
                      <div>{item.addr}</div>
                      <div>{item.netmask}</div>
                      <div>{item.broadcast_addr}</div>
                      <div>{item.mac_addr}</div>
                    </div>
                  );
                })}
              </div>
              <div>
                <Switch
                  checked={settings.autoDiscover}
                  checkedChildren={<div>Discover Enabled</div>}
                  unCheckedChildren={<div>Discover Disabled</div>}
                  onChange={(checked) => {
                    fetch(
                      `http://127.0.0.1:18000/api/setting/auto_discover?active=${checked}`,
                      {
                        method: "put",
                        // headers: {
                        //   "Content-Type": "application/json",
                        // },
                      }
                    ).then(() => {
                      setSettings({
                        ...settings,
                        autoDiscover: checked,
                      });
                    });
                  }}
                >
                  Auto Discover
                </Switch>
              </div>
            </>
          }
        />
      </Skeleton>
    </Card>
  );
};
export default DeviceDetail;
