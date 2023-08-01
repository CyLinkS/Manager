import {createApp} from 'vue'

import App from './App.vue'
import router from './router'
import '@/assets/style/reset.css'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from "@/stores";
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'dayjs/locale/zh-cn'


const app = createApp(App)

console.log('环境变量=>', import.meta.env)

app.use(ElementPlus, {
    locale: zhCn,
})
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store)
app.use(router)
app.mount('#app')