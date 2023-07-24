import axios from "axios";
import config from "@/config";
import {ElMessage} from 'element-plus'
import router from '@/router'
// 状态
const TOKEN_INVALID = 'Token认证失败,请重新登陆'
const NETWORK_ERR = '网络异常,请稍后再试'
// 创建axios实例对象,添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000,
})
// 请求拦截
service.interceptors.request.use((req) => {
    const headers = req.headers
    if (!headers.Authorization) headers.Authorization = 'Bear Test'
    return req
})
//响应拦截
service.interceptors.response.use((res) => {
    const {code, data, msg} = res.data
    if (code === 200) {
        return data
    } else if (code === 40001) {
        // 40001 是判定token有问题
        ElMessage.error(msg ? msg : TOKEN_INVALID)
        setTimeout(() => {
            // 这里会有提示
            router.push({path: "/login"}).then()
        }, 1500)
        return Promise.reject(TOKEN_INVALID)
    } else {
        // 都没问题就是网络波动问题
        ElMessage.error(msg || NETWORK_ERR)
        return Promise.reject(msg || NETWORK_ERR)
    }
})


/**
 * 请求的核心函数
 * @param options 请求配置
 * */
function request(options) {
    // 默认GET请求
    options.method = options.method || 'GET'
    if (options.method.toLocaleLowerCase() === 'get') {
        options.params = options.data
    }

    let mock = config.mock
    if ('mock' in options) {
        mock = options.mock
    }
    // TODO 如果是生产模式,一定是调用线上地址
    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi
    } else {
        service.defaults.baseURL = mock ? config.mockApi : config.baseApi
    }
    return service(options)
}

export default request