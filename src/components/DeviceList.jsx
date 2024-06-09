import {
  Avatar,
  List,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Flex,
  Popconfirm,
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import laptopIcon from "../images/ico2068.ico";
import Upload from "antd/es/upload/Upload";

const DeviceList = () => {
  const [remoteAvail, setRemoteAvail] = useState(false);
  const [remotes, setRemotes] = useState([]);
  const [peer, setPeer] = useState(null);
  const [side, setSide] = useState("");
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const getRemotePeer = () => {
    fetch("http://127.0.0.1:18000/api/remote_peer")
      .then((res) => res.json())
      .then((_peer) => {
        setSide(_peer?.side);
        setPeer(_peer?.remote);
      });
  };

  const getList = () => {
    fetch("http://127.0.0.1:18000/api/remotes")
      .then((res) => res.json())
      .then((_remotes) => {
        const remote = _remotes.find((item) => item.ip === peer?.ip);
        if (remote) {
          setRemoteAvail(true);
          setRemotes(_remotes);
        } else {
          setRemoteAvail(false);
          if (peer) {
            _remotes.push(peer);
            setRemotes(_remotes);
          }
        }
      });
  };

  useEffect(() => {
    if (peer) {
      getList();
    }
  }, [peer]);

  useEffect(() => {
    // getList();
    getRemotePeer();
  }, []);

  const setRemotePeer = (side, remote) => {
    fetch(
      `http://127.0.0.1:18000/api/remote_peer?side=${side}&ip=${remote.ip}`,
      {
        method: "put",
      }
    )
      .then((res) => res.json())
      .then(() => {
        setPeer(remote);
        setSide(side);
        message.success("remote peer set");
      });
  };

  const clearRemotePeer = () => {
    fetch(`http://127.0.0.1:18000/api/remote_peer`, {
      method: "delete",
    })
      .then((res) => res.json())
      .then(() => {
        message.success("remote peer cleared");
        setPeer(null);
      });
  };

  const deleteRemotePeer = (remote) => {
    fetch(`http://127.0.0.1:18000/api/remotes?ip=${remote.ip}`, {
      method: "delete",
    })
      .then((res) => res.json())
      .then(() => {
        getList();
      });
  };

  const wakeRemotePeer = (side, remote) => {
    fetch(`http://127.0.0.1:18000/api/launch?ip=${remote.ip}&side=${side}`, {
      method: "post",
    })
      .then((res) => res.json())
      .then(() => {
        getList();
      });
  };

  return (
    <div>
      <div
        style={{
          borderBottom: "1px solid",
          padding: 8,
        }}
      >
        <Space>
          <Button
            type="primary"
            onClick={() => {
              clearRemotePeer();
            }}
          >
            UNSET
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
            icon={<PlusOutlined />}
          >
            CUSTOME
          </Button>
        </Space>
      </div>
      <List
        dataSource={remotes}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar shape="square" size={64} src={laptopIcon} />}
              title={
                <div>
                  <span>{item.hostname}</span>
                  {!remoteAvail && (
                    <Tag color="error" style={{ marginLeft: "1em" }}>
                      离线
                    </Tag>
                  )}
                </div>
              }
              description={
                <div>
                  <div>{item.ip}</div>
                  <div>{`${item.screen_size.right - item.screen_size.left} x ${
                    item.screen_size.bottom - item.screen_size.top
                  }`}</div>
                  <Space
                    align="start"
                    style={{
                      marginBottom: 8,
                    }}
                  >
                    <Button
                      type={
                        item?.ip === peer?.ip && side === "LEFT"
                          ? "primary"
                          : "default"
                      }
                      onClick={() => {
                        setRemotePeer("LEFT", item);
                      }}
                    >
                      Left
                    </Button>
                    <Button
                      type={
                        item?.ip === peer?.ip && side === "RIGHT"
                          ? "primary"
                          : "default"
                      }
                      onClick={() => {
                        setRemotePeer("RIGHT", item);
                      }}
                    >
                      Right
                    </Button>
                    <Popconfirm
                      title="Delete the remote"
                      description="Are you sure to delete this remote?"
                      onConfirm={() => {
                        deleteRemotePeer(item);
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>
                    <Button
                      // disabled
                      type={item?.ip === peer?.ip ? "primary" : "default"}
                      onClick={() => {
                        wakeRemotePeer(side, item);
                        // setRemotePeer("RIGHT", item);
                      }}
                    >
                      Wake On LAN
                    </Button>
                    <Upload
                      disabled={peer?.ip !== item?.ip}
                      action={`http://${peer?.ip}:18000/api/file`}
                      multiple
                    >
                      <Button disabled={peer?.ip !== item?.ip}>
                        Transfer Files
                      </Button>
                    </Upload>
                  </Space>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Modal
        title="Add Custome Remote"
        open={open}
        closable={false}
        footer={null}
      >
        <Form
          form={form}
          style={{
            marginTop: 20,
          }}
          labelCol={{
            span: 5,
          }}
          onFinish={(values) => {
            console.log(values);
            fetch("http://127.0.0.1:18000/api/remotes", {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ip: values.ip,
                hostname: values.hostname,
                screen_size: [
                  Number(values.screen_size_x),
                  Number(values.screen_size_y),
                ],
              }),
            })
              .then((res) => res.json())
              .then(() => {
                getList();
                setOpen(false);
                form.resetFields();
              });
          }}
        >
          <Form.Item
            label="hostname"
            name="hostname"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="ip" name="ip" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="screen size x"
            name="screen_size_x"
            rules={[{ required: true }]}
          >
            <Input style={{ width: 100 }} />
          </Form.Item>
          <Form.Item
            label="screen size y"
            name="screen_size_y"
            rules={[{ required: true }]}
          >
            <Input style={{ width: 100 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Flex justify="right">
              <Space>
                <Button
                  onClick={() => {
                    setOpen(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </Space>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceList;
