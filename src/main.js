import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'

if (process.env.NODE_ENV !== 'production') {
    //require('element-plus/lib/theme-chalk/index.css')
    require('element-plus/theme-chalk/index.css')
} 

createApp(App)
.use(ElementPlus)
.use(store)
.use(router)
.mount('#app')
