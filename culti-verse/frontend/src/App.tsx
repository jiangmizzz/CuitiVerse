// import { useState } from "react";
import "./App.css";
import "./assets/reset.css";
import headLogo from "./assets/logo.svg";
import Setting from "./components/Setting/Setting";

function App() {
  return (
    <>
      <div className="main">
        <div className="app-header">
          <div className="app-logo">
            <img
              src={headLogo}
              style={{
                height: "2.3em",
                objectFit: "cover",
              }}
            />
          </div>
          <Setting />
        </div>
      </div>
    </>
  );
}

export default App;
