import {createApp} from 'vue'

import App from './App.vue'
import router from './router'
import '@/assets/style/reset.css'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from "@/stores";

const app = createApp(App)

console.log('环境变量=>', import.meta.env)


// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store)
app.use(router)
app.mount('#app')