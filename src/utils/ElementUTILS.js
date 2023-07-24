import {ElNotification} from "element-plus";


// 通知组件
export const Notification = (message = "操作成功", type = "success") => {
    ElNotification({
        message: message,
        type: type,
        offset: 50,
    })
}