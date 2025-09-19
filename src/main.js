import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'  // 부트스트랩 드랍다운기능있음
import "@/services/test/mock.js"; //임시 목업데이터

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { setupCalendar } from 'v-calendar';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(BootstrapVue3)

app.component('VueDatePicker', VueDatePicker);
setupCalendar(app);

app.mount('#app')