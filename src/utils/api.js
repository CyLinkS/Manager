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

export const getMenuList = () => {
    return request({
        url: '/menu/list',
        method: 'get',
        data: {}
    })
}