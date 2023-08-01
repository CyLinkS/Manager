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
        data: {}
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