import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-z1nq3fsa7z11hzqj.us.auth0.com"
      clientId="xlTktmQIW5fS1PtaUHBGQKcQIVQuFEKz"
      audience="https://dev-z1nq3fsa7z11hzqj.us.auth0.com/api/v2/"
      scope="openid profile email"
      authorizationParams={{
       
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </BrowserRouter>
);
