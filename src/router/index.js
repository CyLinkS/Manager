import {createRouter, createWebHistory} from 'vue-router'
import Welcome from './../components/Welcome.vue'
import Home from './../components/Home.vue'
import Login from '../components/Login.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: '首页',
            },
            redirect: 'Welcome',
            // 这里的welcome组件会嵌套进home组件,所以外围的组件是Home
            children: [
                {
                    name: 'Welcome',
                    path: '/welcome',
                    component: Welcome,
                    meta: {
                        title: '欢迎',
                    },
                }, {
                    name: 'login',
                    path: '/login',
                    component: Login,
                    meta: {
                        title: '登陆',
                    },
                }
            ]
        },
    ]
})

export default router