<script setup>
import {onMounted, ref, watch} from "vue";
import {useUserStore} from "@/stores/user";
import {getNoticeCount, getMenuList} from '@/utils/api'
import {storeToRefs} from 'pinia'
import TreeMenu from "@/components/TreeMenu.vue";
import {ArrowDown, BellFilled, Expand, Fold} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import BreadCrumb from "@/components/BreadCrumb.vue";
import storage from "@/utils/storage";
// 获取store中的用户信息
const userStore = useUserStore()
let {userInfo} = storeToRefs(userStore)

// 切换侧边栏字段定义
const isCollapse = ref(false)

// 定义notice 提示小红点
let noticeCount = ref(0)

// 返回notice请求函数
const handleNoticeCount = async () => {
    try {
        let res = await getNoticeCount()
        noticeCount.value = Number(res)
    } catch (err) {
        await Promise.reject(err)
    }
}

// 定义菜单列表
const userMenu = ref([])

// 对菜单的请求赋值
const handleMenuList = async () => {
    try {
        let res;
        res = await getMenuList();
        userMenu.value = res
    } catch (err) {
        await Promise.reject(err)
    }
}

// 定义当前的菜单
const route = useRoute()
const activeMenu = ref('')
const router = useRouter()
watch(route, (newVal) => {
    activeMenu.value = newVal.fullPath
})


// 在组件挂载时候请求一次
onMounted(() => {
    handleNoticeCount()
    handleMenuList()
    activeMenu.value = route.fullPath
})

// 处理退出登陆函数
const handleLogout = (key) => {
    if (key === 'email') return
    storage.clearAll()
    userStore.logOut()
    router.push('/login')
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
            <!--TODO 导航菜单-->
            <el-menu
                router
                background-color="#001529"
                text-color="#fff"
                :default-active='activeMenu'
                class="nav-menu"
                :collapse="isCollapse"
            >
                <tree-menu :userMenu="userMenu"/>
            </el-menu>
        </div>
        <!--  右边结构  -->
        <div :class="['content-right',isCollapse?'fold':'unfold']">
            <!--TODO 右边结构分为上下-->
            <!--上结构-->
            <div class="nav-top">
                <div class="nav-left">
                    <div class="icon">
                        <el-icon @click="toggleFold" v-if="!isCollapse">
                            <Fold/>
                        </el-icon>
                        <el-icon @click="toggleFold" v-else>
                            <Expand/>
                        </el-icon>
                    </div>
                    <div class="bread">
                        <BreadCrumb/>
                    </div>
                </div>
                <div class="user-info">
                    <el-badge :is-dot="noticeCount>0" class="notice">
                        <el-icon>
                            <BellFilled/>
                        </el-icon>
                    </el-badge>
                    <el-dropdown @command="handleLogout" class="user-link">
                          <span class="el-dropdown-link">
                              {{ userInfo['userName'] }}
                              <el-icon class="el-icon--right">
                                <arrow-down/>
                              </el-icon>
                          </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="email">
                                    邮箱: {{ userInfo['userEmail'] }}
                                </el-dropdown-item>
                                <el-dropdown-item command="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <!--            -->
            <!--下内容区 -->
            <div class="wrapper">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.basic-layout {
    position: relative;

    .nav-side {
        z-index: 10;
        position: absolute;
        width: 200px;
        height: 100vh;
        background: #001529;
        color: white;
        overflow: hidden;
        user-select: none;
        transition: width .3s;

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
            position: relative;
            line-height: 50px;
            display: flex;
            justify-content: space-between;
            box-shadow: 0 1px 5px #ccc;
            padding: 0 20px;
            user-select: none;

            .nav-left {
                display: flex;
                align-items: center;

                .icon {
                    display: flex;
                    align-items: center;
                    margin-right: 15px;
                }
            }

            .user-info {
                .notice {
                    margin-right: 15px;

                    // 修改element UI 使用深度穿透
                    :deep(.el-badge__content) {
                        position: absolute;
                        left: 5px;
                        top: 15px;
                        width: 5px;
                        height: 5px;
                        border-radius: 50%;
                    }

                    &:hover {
                        color: tomato;
                        cursor: pointer;
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
            overflow-y: auto;

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