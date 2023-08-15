import request from "@/utils/request";

export const Login = (params) => {
    return request({
        url: '/users/login',
        method: 'post',
        data: params,
    })
}
// 小红点提示数量
export const getNoticeCount = () => {
    return request({
        url: '/leave/count',
        method: 'get',
        data: {},
    })
}
// 菜单列表
export const getMenuList = () => {
    return request({
        url: '/menu/list',
        method: 'get',
        data: {},
    })
}
//用户列表
export const getUserList = (params) => {
    return request({
        url: '/users/list',
        method: 'get',
        data: params
    })
}
// 用户删除(可以单个删除也可以批量删除)
export const UserDel = (params) => {
    return request({
        url: '/users/delete',
        method: 'post',
        data: params
    })
}
// 角色名称列表
export const getRoleAllList = () => {
    return request({
        url: '/roles/allList',
        method: 'get',
        data: {}
    })
}

// 部门列表
export const getDeptListApi = () => {
    return request({
        url: '/dept/list',
        method: 'get',
        data: {}
    })
}

//用户管理数据提交
export const userSubmit = (params) => {
    return request({
        url: '/users/operate',
        method: 'post',
        data: params
    })
}

//菜单管理数据提交
export const menuSubmit = (params) => {
    return request({
        url: '/menu/operate',
        method: 'post',
        data: params
    })
}
//获取用户角色列表
export const getRoleList = (params) => {
    return request({
        url: '/roles/list',
        method: 'get',
        data: params
    })
}
// 角色操作
export const roleSubmit = (params) => {
    return request({
        url: '/roles/operate',
        method: 'post',
        data: params
    })
}