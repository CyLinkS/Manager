import {createApp, onBeforeMount} from 'vue'

import App from './App.vue'
import routes from './router'
import '@/assets/style/reset.css'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from "@/stores";
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'dayjs/locale/zh-cn'
import storage from "@/utils/storage";


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
app.use(routes.router)
app.mount('#app')

// 判断按钮是否显示
app.directive('has', {
    beforeMount: (el, binding) => {
        // 获取按钮权限
        let userAction = storage.getItem('actionList')
        let value = binding.value
        // 判断列表中是否有权限标识
        let hasPermission = userAction.includes(value)
        if (!hasPermission) {
            // 没有权限就隐藏加删除
            el.style = 'display:none'
            setTimeout(() => {
                el.parentNode.removeChild(el)
            }, 0)
        }
    }
})
