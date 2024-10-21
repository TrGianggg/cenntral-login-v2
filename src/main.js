import './design/main.scss'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import 'ant-design-vue/dist/antd.css'
import '@/assets/icons/ico-moon/style.css'
import { createApp } from 'vue'
import { i18n } from '@/locale/index.js'
import Antd from 'ant-design-vue'
import router from './router'
import { setupStore } from './stores'
import App from './App.vue'
import mitt from 'mitt'
import VueCountdown from '@chenfengyuan/vue-countdown'
const emitter = mitt()
const app = createApp(App)

setupStore(app)
app.provide('emitter', emitter)
app.use(router)
app.use(i18n)
app.use(Antd)
app.component(VueCountdown.name, VueCountdown)
app.mount('#app')
