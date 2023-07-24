import request from "@/utils/request";

export const Login = (params) => {
    return request({
        url: '/login',
        method: 'post',
        data: params,
    })
}