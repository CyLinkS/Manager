<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.replace('/welcome')
}
</script>

<template>
  <h2>登录</h2>
  <el-button @click="goHome">去首页</el-button>
</template>

<style scoped>

</style>