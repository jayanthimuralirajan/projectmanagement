import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./UserContext"; // Import context provider
<meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <App />
  </UserProvider>
);
