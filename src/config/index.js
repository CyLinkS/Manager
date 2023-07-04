// 环境配置封装
/**
 *  development: 开发环境
 *  test:测试环境
 *  prod:生产环境
 * */
const env = import.meta.env.MODE || 'prod'

// 配置不同的环境API
const EnvConfig = {
    development: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/3874d978d2ecb3796afc4e27daaec050/crud'
    },
    test: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/3874d978d2ecb3796afc4e27daaec050/crud'
    },
    prod: {
        baseApi: '//prod.future.com/api',
        mockApi: ''
    }
}
export default {
    // 默认是开发
    env,
    mock: true,
    ...EnvConfig[env]
}