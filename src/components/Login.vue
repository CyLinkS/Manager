<script setup>
import {useRouter} from 'vue-router'
import {Login} from "@/utils/api"

const router = useRouter()
const goHome = () => {
  router.replace('/welcome')
}
const testApi = async () => {
  let res = await Login({
    method: 'GET',
    url: '/login',
    data: {name: 'zs'}
  })
}
</script>

<template>
  <h2>登录</h2>
  <el-button @click="goHome">去首页</el-button>
  <el-button @click="testApi">测试接口</el-button>
</template>

<style scoped>

</style>