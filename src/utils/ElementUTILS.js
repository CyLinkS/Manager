import {ElNotification, ElMessage} from "element-plus";


// 通知组件
export const Notification = (message = "操作成功", type = "success") => {
    ElNotification({
        message: message,
        type: type,
        offset: 50,
    })
}
export const Message = (message = "操作成功", type = 'success') => {
    ElMessage({
        message,
        type

    })
}
