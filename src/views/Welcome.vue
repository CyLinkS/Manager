<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

const goLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="welcome">
    <h2>欢迎到主界面</h2>
    <el-button @click="goLogin">去登陆</el-button>
  </div>
</template>

<style lang="scss">
</style>
