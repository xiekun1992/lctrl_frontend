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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import laptopIcon from "../images/ico2068.ico";

const DeviceList = () => {
  const [remotes, setRemotes] = useState([]);
  const [peer, setPeer] = useState(null);
  const [side, setSide] = useState("");
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const getList = () => {
    fetch("http://127.0.0.1:8000/remotes")
      .then((res) => res.json())
      .then((_remotes) => {
        setRemotes(_remotes);
      });
  };

  const getRemotePeer = () => {
    fetch("http://127.0.0.1:8000/remote_peer")
      .then((res) => res.json())
      .then((_peer) => {
        const remote = remotes.find((item) => item.ip === _peer?.remote?.ip);
        if (remote) {
          setPeer(remote);
          setSide(_peer?.side);
        }
      });
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    getRemotePeer();
  }, [remotes]);

  const setRemotePeer = (side, remote) => {
    fetch(`http://127.0.0.1:8000/remote_peer?side=${side}&ip=${remote.ip}`, {
      method: "put",
    })
      .then((res) => res.json())
      .then(() => {
        setPeer(remote);
        setSide(side);
        message.success("remote peer set");
      });
  };

  const clearRemotePeer = () => {
    fetch(`http://127.0.0.1:8000/remote_peer`, {
      method: "delete",
    })
      .then((res) => res.json())
      .then(() => {
        message.success("remote peer cleared");
        setPeer(null);
      });
  };

  const deleteRemotePeer = (remote) => {
    fetch(`http://127.0.0.1:8000/remotes?ip=${remote.ip}`, {
      method: "delete",
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
              title={<span>{item.hostname}</span>}
              description={
                <div>
                  <div>{item.ip}</div>
                  <div>{item.screen_size.join(" x ")}</div>
                  <Space
                    style={{
                      marginBottom: 8,
                    }}
                  >
                    <Button
                      type={
                        item === peer && side === "LEFT" ? "primary" : "default"
                      }
                      onClick={() => {
                        setRemotePeer("LEFT", item);
                      }}
                    >
                      LEFT
                    </Button>
                    <Button
                      type={
                        item === peer && side === "RIGHT"
                          ? "primary"
                          : "default"
                      }
                      onClick={() => {
                        setRemotePeer("RIGHT", item);
                      }}
                    >
                      RIGHT
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
                      <Button danger>DELETE</Button>
                    </Popconfirm>
                  </Space>
                  <Space>
                    <Button
                      disabled
                      // type={item === peer ? "primary" : "default"}
                      onClick={() => {
                        // setRemotePeer("RIGHT", item);
                      }}
                    >
                      Wake On LAN
                    </Button>
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
            fetch("http://127.0.0.1:8000/remotes", {
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
