// import "./App.css";
// import { useEffect, useState } from "react";
import DeviceList from "./components/DeviceList";
import DeviceDetail from "./components/DeviceDetail";

function App() {
  // useEffect(() => {
  //   const ws = new WebSocket("ws://127.0.0.1:8000/ws");
  //   ws.onopen = () => {
  //     console.log("opened");
  //   };
  //   return () => {
  //     ws.close();
  //   };
  // }, []);

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
