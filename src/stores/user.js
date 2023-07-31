import {defineStore} from "pinia";
import storage from "@/utils/storage";

export const useUserStore = defineStore({
    // 每个模块都有独立的id
    id: 'user',
    state() {
        return {
            userInfo: '' || storage.getItem('userInfo') // 获取用户信息
        }
    },
    actions: {
        saveUserInfo(payload) {
            this.userInfo = payload
            // storage.setItem('userInfo', payload)
        }
    },
    // 开启数据缓存
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'manager',
                storage: localStorage
            }
        ]
    }
})