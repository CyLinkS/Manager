<script setup>
import {ArrowRight} from "@element-plus/icons-vue";
import {useRoute} from "vue-router";
import {computed} from "vue";

const Route = useRoute()
// 获取路由层级关系
const breadList = computed(() => {
    return Route.matched
})
</script>

<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item to="/welcome" v-for="item in breadList" :key="item.path">{{
                item.meta['title']
            }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style scoped lang="scss">

</style>