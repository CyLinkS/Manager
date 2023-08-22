import config from "@/config";

/**
 * Storage二次封装
 * */
export default {
    setItem (key, val) {
        let storage = this.getStorage()
        storage[key] = val
        window.localStorage.setItem(config.namespace, JSON.stringify(storage))
    },
    getItem (key) {
        return this.getStorage()[key]
    },
    // 取到命名空间
    getStorage () {
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
    },
    clearItem (key) {
        let storage = this.getStorage()
        delete storage[key]
        window.localStorage.setItem(config.namespace, JSON.stringify(storage))
    },
    clearAll () {
        window.localStorage.clear()
    },

}