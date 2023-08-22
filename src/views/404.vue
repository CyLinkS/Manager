<template>
    <el-result title="404" sub-title="对不起,找不到回家的路了 ">
        <template #icon>
            <el-image
                src="https://mat1.gtimg.com/www/mobi/2017/image/404.png"
            />
        </template>
        <template #extra>
            <el-button type="primary" @click="goHome">返回首页</el-button>
        </template>
    </el-result>
</template>
<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

const goHome = () => {
    router.replace('/')
}
</script>