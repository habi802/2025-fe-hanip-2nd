
if (import.meta.env.VITE_USE_MOCK === 'true') {
    import('@/services/test/mock.js'); // mock.js가 실행되면서 axios에 목업(임시데이터)이 붙음!
  }
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'  // 부트스트랩 드랍다운기능있음

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { setupCalendar } from 'v-calendar';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia).use(router).use(BootstrapVue3)

app.component('VueDatePicker', VueDatePicker);
setupCalendar(app);

router.isReady().then(() => {
    app.mount('#app');
});