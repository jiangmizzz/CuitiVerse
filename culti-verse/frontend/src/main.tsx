// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import "react-photo-view/dist/react-photo-view.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  // 2. Wrap ChakraProvider at the root of your app
  <ChakraProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </ChakraProvider>
  // </React.StrictMode>
);
