let arr = [1, 2, 3, 4]
let res = arr.reduce((pre, cur) => {
    return pre += cur
}, 0)
console.log(res)
let a = 1
let b = 1
const router = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/components/Home.vue'),
        meta: {
            title: '首页',
        },
        redirect: 'welcome',
        // 这里的welcome组件会嵌套进home组件,所以外围的组件是Home
        children: [
            {
                name: 'welcome',
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
            },
            {
                name: 'dept',
                path: '/system/dept',
                meta: {
                    title: '部门管理'
                },
                component: () => import('@/views/Dept.vue')
            },
        ]
    }, {
        name: 'login',
        path: '/login',
        component: () => import('../views/Login.vue'),
        meta: {
            title: "登陆"
        }
    }, {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue')
    }, {
        path: '/:pathMatch(.*)',
        redirect: '/404'
    }
]

