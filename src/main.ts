import "@/styles/main.css";
import "@/styles/tailwind.css";

import App from "@/App.vue";
import { createPinia } from "pinia";
import { createApp } from "vue";

const app = createApp(App);
const store = createPinia();

app.use(store);
app.mount("#app");
