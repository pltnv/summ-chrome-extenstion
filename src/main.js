import { mount } from "svelte";
import "./app.css";
import Popup from "./popup/Popup.svelte";

const app = mount(Popup, {
  target: document.getElementById("app"),
});

export default app;
