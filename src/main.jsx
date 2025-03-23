import { render } from "preact";
import "./index.css";
import { App } from "./app.jsx";
import { LocationProvider } from "preact-iso";

render(
  <LocationProvider>
    <App />
  </LocationProvider>,
  document.getElementById("app")
);
