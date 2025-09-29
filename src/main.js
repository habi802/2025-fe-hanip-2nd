import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import "@/services/test/mock.js"; //임시 목업데이터

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia).use(router).use(BootstrapVue3);

router.isReady().then(() => {
    app.mount('#app');
});