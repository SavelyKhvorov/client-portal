import "./styles/styles.less";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const app = createApp(App);
const pinia = createPinia();

pinia.use(({ store }) => {
  store.$global = app.config.globalProperties;
})

app.config.globalProperties.$axios = axios;
app.use(pinia).use(router);
router.isReady().then(() => app.mount("#app"));