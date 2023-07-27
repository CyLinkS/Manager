<script setup>
import {ArrowDown, Bell, Fold, Setting} from "@element-plus/icons-vue";
import {ref} from "vue";
// 用户信息定义
const userInfo = ref({
    userName: 'Link',
    userEmail: '188888@163.com'
})

// 切换侧边栏字段定义
const isCollapse = ref(false)

// 处理退出登陆函数
const handleLogout = (key) => {
    if (key === 'email') return
    console.log('退出登陆')
}
// 切换侧边栏菜单宽度
const toggleFold = () => {
    isCollapse.value = !isCollapse.value
}
</script>

<template>
    <!--首先分左右结构-->
    <div class="basic-layout">
        <!--  左边结构  -->
        <div :class="['nav-side',isCollapse?'fold':'unfold']">
            <!--系统logo-->
            <div class="logo">
                <img src="@/assets/images/logo-with-shadow.png" alt="">
                <span>Vite</span>
            </div>
            <!--导航菜单-->
            <el-menu
                router
                background-color="#001529"
                text-color="#fff"
                default-active="2"
                class="nav-menu"
                :collapse="isCollapse"
            >
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <Setting/>
                        </el-icon>
                        <span>系统管理</span>
                    </template>
                    <el-menu-item index="1">用户管理</el-menu-item>
                    <el-menu-item index="2">菜单管理</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </div>
        <!--  右边结构  -->
        <div :class="['content-right',isCollapse?'fold':'unfold']">
            <!--TODO 右边结构分为上下-->
            <!--上结构-->
            <div class="nav-top">
                <div class="nav-left">
                    <el-icon @click="toggleFold">
                        <Fold/>
                    </el-icon>
                    <div class="bread">面包屑</div>
                </div>
                <div class="user-info">
                    <el-badge :is-dot="true" class="notice">
                        <el-icon>
                            <Bell/>
                        </el-icon>
                    </el-badge>
                    <el-dropdown @command="handleLogout" class="user-link">
                          <span class="el-dropdown-link">
                              {{ userInfo.userName }}
                              <el-icon class="el-icon--right">
                                <arrow-down/>
                              </el-icon>
                          </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="email">{{ userInfo.userEmail }}</el-dropdown-item>
                                <el-dropdown-item command="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <!--            -->
            <!--下内容区 -->
            <div class="wrapper">
                <div class="main-page">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.basic-layout {
    position: relative;

    .nav-side {
        position: absolute;
        width: 200px;
        height: 100vh;
        background: #001529;
        color: white;
        overflow: hidden;
        transition: width .5s;

        .logo {
            display: flex;
            align-items: center;
            font-size: 18px;
            height: 50px;
            overflow-x: hidden;

            img {
                margin: 0 16px;
                width: 32px;
                height: 32px;
            }
        }

        .nav-menu {
            border-right: none;
            height: calc(100vh - 50px);
        }

        // 合并侧边菜单
        &.fold {
            width: 64px;
        }

        // 展开侧边菜单
        &.unfold {
            width: 200px;
        }
    }

    .content-right {
        margin-left: 200px;

        .nav-top {
            height: 50px;
            line-height: 50px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #001529;
            padding: 0 20px;
            user-select: none;

            .nav-left {
                display: flex;
                align-items: center;

                .el-icon {
                    margin-right: 15px;
                }
            }

            .user-info {
                .notice {
                    margin-right: 15px;

                    // 修改element UI 使用深度穿透
                    :deep(.el-badge__content) {
                        position: absolute;
                        top: 10px;
                    }
                }

                .el-dropdown {
                    line-height: 50px;
                }

                :deep(.el-dropdown-link:focus) {
                    outline: none;
                }

                .user-link {
                    cursor: pointer;
                    color: #409eff;
                }
            }
        }

        .wrapper {
            background: #eef0f3;
            padding: 20px;
            height: calc(100vh - 50px);

            .main-page {
                background: #fff;
                //height: calc(100vh - 90px);
                height: 100%;
            }
        }

        &.fold {
            margin-left: 64px;
        }

        &.unfold {
            margin-left: 200px;
        }
    }
}
</style>