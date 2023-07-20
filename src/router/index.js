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