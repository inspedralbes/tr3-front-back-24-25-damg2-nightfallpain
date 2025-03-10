import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify"; // Si usas Vuetify

createApp(App).use(router).use(vuetify).mount("#app");
