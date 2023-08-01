<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

</script>

<template>
    <div class="welcome">
        <!--描述-->
        <div class="content">
            <div class="sub-title">Welcome</div>
            <div class="desc"> - Vue3.0+Vite 通用权限管理系统</div>
        </div>
    </div>
</template>

<style lang="scss">
.welcome {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;

    .sub-title {
        font-size: 30px;
        line-height: 42px;
        color: #409eff;
    }

    .desc {
        text-align: right;
        font-size: 14px;
        color: #999;
    }
}
</style>
