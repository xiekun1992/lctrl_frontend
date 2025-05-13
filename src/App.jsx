// import "./App.css";
import { useEffect, useRef, useState } from "react";
import DeviceList from "./components/DeviceList";
import DeviceDetail from "./components/DeviceDetail";
import useStore from "./store/index.ts";
import ScreenSetting from "./components/ScreenSetting/index.jsx";
import { Tabs } from "antd";

function App() {
  const { setRemotes, primaryScreen, remoteScreens, updateRemoteScreens } =
    useStore();

  useEffect(() => {
    const es = new EventSource("http://127.0.0.1:18000/api/sse");
    es.onopen = (e) => {
      console.log("sse connected", e);
    };
    es.onmessage = (e) => {
      console.log("Got:", e);
    };
    es.onerror = (e) => {
      console.error("sse connect failed", e);
    };

    es.addEventListener("update.remotes", (e) => {
      let result = {};
      try {
        result = JSON.parse(e.data);
      } catch {}
      setRemotes([...result.manual_remotes, ...result.remotes]);
    });

    return () => {
      es.close();
    };
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        height: "100vh",
        background: "#f9f9f9",
        gap: 8,
      }}
    >
      <aside
        style={{
          flex: "300px 0 0",
          background: "#fff",
        }}
      >
        <DeviceList />
      </aside>
      <main
        style={{
          background: "#fff",
          flex: "1 1",
          display: "flex",
          flexDirection: "column",
          fontSize: 0,
        }}
      >
        <DeviceDetail />
        <Tabs
          items={[
            {
              key: "1",
              label: "Screen Setting",
              children: (
                <ScreenSetting
                  primaryScreen={primaryScreen}
                  remoteScreens={remoteScreens}
                  updateScreens={updateRemoteScreens}
                />
              ),
            },
          ]}
        />
      </main>
    </div>
  );
}

export default App;
