import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import '@/assets/style/reset.css'

const app = createApp(App)

console.log('环境变量=>', import.meta.env)

app.use(createPinia())
app.use(router)
app.mount('#app')
