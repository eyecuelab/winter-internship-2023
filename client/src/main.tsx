import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { google_client_id } from "./../GoogleClient";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GoogleOAuthProvider clientId={google_client_id}>
    <App />
  </GoogleOAuthProvider>
);
