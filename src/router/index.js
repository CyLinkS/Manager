import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/components/Home.vue'
import storage from "@/utils/storage";
import {getPermissionList} from "@/utils/api";
import generateRoute from "@/router/utils";
import {Message} from "@/utils/ElementUTILS";

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


// TODO 动态路由的思路
// router.addRoute('home', {
//     name: 'zs',
//     path: 'system/zs',
//     meta:{
//          title:'张三'
//     }
//     component: () => import('@/views/zs.vue')
// })
router.beforeEach(async (to, from, next) => {
    let userInfo = storage.getItem('userInfo') || []
    let token = userInfo.token || ''
    if (token) {
        if (token && to.path === '/login') {
            Message('已登陆,请退出再试', 'error')
            next('/')
        } else {
            next()
        }
    } else {
        next()
    }
})
// 修改标题的工作可以放在全局后置守卫
router.afterEach((to, from) => {
    if (to.meta['title']) {
        document.title = to.meta['title'] || 'ViteApp-权限管理系统'
    }
});

export default {router, loadAsyncRoutes}