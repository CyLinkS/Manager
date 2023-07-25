<script setup>
import {User, View} from '@element-plus/icons-vue'
import {ref} from "vue";
import {Login} from "@/utils/api";
import {Notification} from "@/utils/ElementUTILS";
import {useShopStore} from "@/stores/user";
import {useRouter} from "vue-router";
// 数据汇总
const data = ref({
    // 用户
    user: {
        userName: "",
        userPwd: '123456',
    }
})
// rules 不需要响应式
const rules = {
    userName: [
        {
            required: true, message: '请输入用户名', trigger: 'blur'
        }
    ],
    userPwd: [
        {
            required: true, message: '请输入用户密码', trigger: 'blur'
        }
    ]
}

// 获取路由器实例
const router = useRouter()

// 得到loginForm dom节点
const loginForm = ref(null)
// 校验输入
const login = () => {
    loginForm.value.validate(async (valid) => {
        if (valid) {
            try {
                const res = await Login(data.value.user)
                Notification('登陆成功', 'success')
                shop.saveUserInfo(res)
                await router.push('/')
            } catch (err) {
                await Promise.reject(err)
            }
        } else {
            return false;
        }
    })
}
// 测试pinia
let shop = useShopStore()

</script>

<template>
    <div class="login-wrapper">
        <div class="model">
            <div class="title">权限管理</div>
            <el-form ref="loginForm" :model="data.user" status-icon :rules="rules">
                <el-form-item prop="userName">
                    <el-input type="text" :prefix-icon="User" v-model="data.user.userName"/>
                </el-form-item>
                <el-form-item prop="userPwd">
                    <el-input type="password" show-password :prefix-icon="View" v-model="data.user.userPwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="login" type="primary" class="login-btn">登陆</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss">
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9fcff;
    width: 100vw;
    height: 100vh;

    .model {
        width: 500px;
        padding: 50px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 0 8px #ccc;

        .title {
            font-size: 30px;
            line-height: 1.5;
            text-align: center;
            margin-bottom: 20px;
        }

        .login-btn {
            width: 100%;
        }
    }
}
</style>