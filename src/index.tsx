import React from "react";
import ReactDOM from "react-dom/client";
import MyButton from "./class-2-component/my-button";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MyButton text="test" />
  </React.StrictMode>
);
