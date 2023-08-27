import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/components/Home.vue'
import storage from "@/utils/storage";
import {getPermissionList} from "@/utils/api";
import generateRoute from "@/router/utils";

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
async function loadAsyncRoutes () {
    let userInfo = storage.getItem('userInfo') || []
    if (userInfo.token) {
        try {
            const {menuList} = await getPermissionList()
            let routes = generateRoute(menuList)
            const modules = import.meta.glob('../views/*.vue')
            routes.map(route => {
                let url = `../views/${route.name}.vue`
                route.component = modules[url];
                router.addRoute("home", route);
            })
        } catch (error) {
            await Promise.reject(error)
        }
    }
}


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
        // 如果name没有就重新再加载一次动态路由步骤
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

export default {router, loadAsyncRoutes}