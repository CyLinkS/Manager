import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/components/Home.vue'
import loadAsyncRoutes from "@/router/routerConfig";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'home',
            path: '/',
            meta: {
                title: '首页'
            },
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    name: 'welcome',
                    path: '/welcome',
                    meta: {
                        title: '欢迎体验Vue3全栈课程'
                    },
                    component: () => import('@/views/Welcome.vue')
                }
            ]
        },
        {
            name: 'login',
            path: '/login',
            meta: {
                title: '登录'
            },
            component: () => import('@/views/Login.vue')
        },
        {
            name: '404',
            path: '/404',
            meta: {
                title: '页面不存在'
            },
            component: () => import('@/views/404.vue')
        }, {
            path: '/:pathMatch(.*)',
            redirect: '/404'
        }
    ]
})

// TODO 只需要使用hasRoute就可以实现
// function checkPermission (path) {
//     return router.getRoutes().some(item => item.path === path)
// }

// 动态路由

await loadAsyncRoutes(router)


// TODO 测试动态路由
// router.addRoute('home', {
//     name: 'zs',
//     path: 'system/zs',
//     component: () => import('@/views/zs.vue')
// })


router.beforeEach(async (to, from, next) => {
    if (to.name) {
        if (router.hasRoute(to.name)) {
            document.title = to.meta['title'] || 'vite'
            next()
        } else {
            next('/404')
        }
    } else {
        // 代表要动态生成
        await loadAsyncRoutes()
        let curRoute = router.getRoutes().filter(item => item.path === to.path)
        if (curRoute?.length) {
            document.title = curRoute[0].meta['title'];
            next({...to, replace: true})
        } else {
            next('/404')
        }
    }
})
export default router