import {defineStore} from "pinia";
import storage from "@/utils/storage";

export const useUserStore = defineStore({
    // 每个模块都有独立的id
    id: 'user',
    state () {
        return {
            userInfo: storage.getItem('userInfo') || {}, // 获取用户信息
            updateTime: +new Date(),
            menuList: storage.getItem('menuList') || [],
            actionList: storage.getItem('actionList') || []
        }
    },
    actions: {
        saveUserInfo (payload) {
            this.userInfo = payload
            storage.setItem('userInfo', payload)
        },
        logOut () {
            this.userInfo = ''
        },
        // 使用此方法来标记菜单列表实时更新
        updateFn () {
            this.updateTime = +new Date() + 1
        },
        saveMenuList (payload) {
            this.menuList = payload
            storage.setItem('menuList', payload)
        },
        saveActionList (payload) {
            this.actionList = payload
            storage.setItem('actionList', payload)
        }
    },
    // 开启数据缓存
    // persist: {
    //     enabled: true,
    //     strategies: [
    //         {
    //             key: 'manager',
    //             storage: localStorage
    //         }
    //     ]
    // }
})