import routes from '@/router/index'
import axios from "axios";
import config from "@/config";
import {ElMessage} from 'element-plus'
import storage from "@/utils/storage";
// 状态
const TOKEN_INVALID = 'Token认证失败,请重新登陆'
const NETWORK_ERR = '网络异常,请稍后再试'
const USER_ERROR = '账号或密码不正确'
// 创建axios实例对象,添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000,
})
// 请求拦截
service.interceptors.request.use((req) => {
    // 给headers添加请求头 token
    const headers = req.headers
    const {token} = storage.getItem('userInfo') || ''
    if (!headers.Authorization) headers.Authorization = 'Bearer ' + token;
    return req
})


//响应拦截
service.interceptors.response.use((res) => {
    const {code, data, msg} = res.data
    if (code === 200) {
        return data
    } else if (code === 20001) {
        // 40001 是判定账号密码问题
        ElMessage.error(msg ? msg : USER_ERROR)
        return Promise.reject(msg)
    } else if (code === 500001) {
        ElMessage.error(msg ? msg : TOKEN_INVALID)
        if (routes) {
            // 这里会有报错提示
            routes.router.push("/login").then()
        } else {
            storage.clearAll()
            window.location.href = ('/login')
        }

        return Promise.reject(msg)

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
function request (options) {
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