import { mount } from "svelte";
import { applyCssVars, createLightHueTicker } from "@igrs/circahue";
import App from "./App.svelte";
import "./app.css";

/** Living brand accent from clock / season / latitude (circahue). */
const hueTicker = createLightHueTicker(
  (snap) => applyCssVars(document.documentElement, snap.cssVars),
  {
    // Matches luminat / circahue design default (Moscow lat); local TZ for hour.
    latitude: 55.75,
    intervalMs: 60_000,
  },
);

const app = mount(App, { target: document.getElementById("app") });

if (import.meta.hot) {
  import.meta.hot.dispose(() => hueTicker.stop());
}

export default app;
