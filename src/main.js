import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './style.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
