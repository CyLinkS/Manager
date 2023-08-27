// 对路由的处理,把格式转换成路由的格式
function generateRoute (menuList) {
    let routes = []
    const deepList = (list) => {
        for (const item of list) {
            if (item.action) {
                routes.push({
                    name: item.component,
                    path: item.path,
                    meta: {
                        title: item.menuName
                    },
                    component: item.component
                })
            }
            if (item.children && !item.action) {
                deepList(item.children)
            }
        }
    }
    deepList(menuList)
    return routes;
}

export default generateRoute