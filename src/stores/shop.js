import {defineStore} from "pinia";
import storage from "@/utils/storage";

export const useShopStore = defineStore({
    // 每个模块都有独立的id
    id: 'shop',
    state() {
        return {
            userInfo: '' || storage.getItem('userInfo') // 获取用户信息
        }
    },
    actions: {
        saveUserInfo(payload) {
            this.userInfo = payload
        }
    },
    // 开启数据缓存
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'shop',
                storage: localStorage
            }
        ]
    }
})