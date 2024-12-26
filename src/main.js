import "./styles/styles.less";


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App);
app.use(router); // Используем роутер
app.mount('#app');