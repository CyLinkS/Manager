import generateRoute from "@/router/utils";
import {getPermissionList} from "@/utils/api";
import storage from "@/utils/storage";


// 动态路由
async function loadAsyncRoutes (router) {
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

export default loadAsyncRoutes