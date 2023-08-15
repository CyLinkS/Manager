import {createRouter, createWebHistory} from 'vue-router'
import Home from './../components/Home.vue'
import storage from "@/utils/storage";
import {Message} from "@/utils/ElementUTILS";

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
                },
                {
                    name: 'user',
                    path: '/system/user',
                    meta: {
                        title: '用户管理'
                    },
                    component: () => import('@/views/User.vue')
                },
                {
                    name: 'menu',
                    path: '/system/menu',
                    meta: {
                        title: '菜单管理'
                    },
                    component: () => import('@/views/Menu.vue')
                },
                {
                    name: 'role',
                    path: '/system/role',
                    meta: {
                        title: '角色管理'
                    },
                    component: () => import('@/views/Role.vue')
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

router.beforeEach((to, from, next) => {
    const {token} = storage.getItem('userInfo') || ''
    if (token) {
        next()
    } else {
        // 没token就返回login
        if (to.path === '/login') {
            next()
        } else {
            next('/login')
            Message('请登陆后再试', 'error')
        }
    }
})

export default router