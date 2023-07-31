<template>
    <!--导航菜单递归子菜单-->
    <template v-for="menu in userMenu">
        <!--包裹在el-sub-menu中的菜单是有收缩箭头的菜单    最后判断是1 是为了干掉按钮,因为按钮的menuType是2,所以进不去不会加载subMenu-->
        <el-sub-menu v-if="menu.children && menu.children.length > 0 && menu.children[0]['menuType'] ===1"
                     :index="menu.path"
                     :key="menu['_id']">
            <template #title>
                <el-icon>
                    <component :is="menu.icon"></component>
                </el-icon>
                <span>{{ menu['menuName'] }}</span>
            </template>
            <tree-menu :userMenu='menu.children'/>
        </el-sub-menu>
        <!--未包裹的是没有收缩箭头的菜单, menuType是1才行,2代表按钮-->
        <el-menu-item v-else-if="menu['menuType'] ===1" :index="menu.path" :key="menu['_id']">
            {{ menu['menuName'] }}
        </el-menu-item>
    </template>

</template>
<script setup>

defineProps({
    userMenu: {
        type: Array,
        default() {
            return []
        }
    }
})
</script>