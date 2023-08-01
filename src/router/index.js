import {createRouter, createWebHistory} from 'vue-router'
import Home from './../components/Home.vue'

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
                    component: () => import('../views/Welcome.vue'),
                    meta: {
                        title: '欢迎体验Vue3权限项目',
                    },
                }, {
                    name: 'user',
                    path: 'user',
                    meta: {
                        title: '用户管理'
                    },
                    component: () => import('@/views/User.vue')
                }
            ]
        }, {
            name: 'login',
            path: '/login',
            component: () => import('../views/Login.vue'),
            meta: {
                title: "登陆"
            }
        }
    ]
})

export default router