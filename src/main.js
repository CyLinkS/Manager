import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import config from "@/config";

const app = createApp(App)

console.log('环境变量=>', import.meta.env)
axios.get(config.mockApi + '/login').then(res => {
    console.log(res.data)
})

app.use(createPinia())
app.use(router)

app.mount('#app')
