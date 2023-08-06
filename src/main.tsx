import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { WagmiProvider } from "@/components/WagmiProvider";
import { UrqlProvider } from "@/components/UrqlProvider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider>
      <UrqlProvider>
        <App />
      </UrqlProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
