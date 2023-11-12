// import "./App.css";
// import { useEffect, useState } from "react";
import DeviceList from "./components/DeviceList";
import ControlPane from "./components/ControlPane";

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
          width: "400px",
          borderRight: "1px solid",
        }}
      >
        <DeviceList />
      </aside>
      <main>
        <ControlPane />
      </main>
    </div>
  );
}

export default App;
