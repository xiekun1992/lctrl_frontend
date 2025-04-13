// import "./App.css";
import { useEffect, useState } from "react";
import DeviceList from "./components/DeviceList";
import DeviceDetail from "./components/DeviceDetail";
import useStore from "./store/index.ts";

function App() {
  const { setRemotes } = useStore();

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
      }}
    >
      <aside
        style={{
          width: "300px",
          borderRight: "1px solid",
        }}
      >
        <DeviceDetail />
      </aside>
      <main
        style={{
          width: "calc(100vw - 300px)",
        }}
      >
        <DeviceList />
      </main>
    </div>
  );
}

export default App;
