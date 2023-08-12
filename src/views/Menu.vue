<template>
    <div class="query-form">
        <el-form inline :model="menuQuery" ref="menuQueryRef">
            <el-form-item label="菜单名称" prop="userId">
                <el-input v-model="menuQuery['userId']" placeholder="请输入菜单名称"/>
            </el-form-item>
            <el-form-item label="菜单状态" prop="state">
                <el-select v-model="menuQuery.state">
                    <el-option :value="1" label="正常"></el-option>
                    <el-option :value="2" label="停用"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="base-table">
        <div class="action">
            <el-button type="primary" size="small" @click="handleCreate">新建菜单</el-button>
        </div>
        <el-table :data="menuList">
            <el-table-column>

            </el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button @click="handleOneCreate(scope.row)" size="small">新增</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

</template>

<script setup>
import {reactive, ref} from "vue";
// 查询菜单字段定义
const menuQuery = reactive({
    state: 1
})

// 获取查询Ref
const menuQueryRef = ref(null)

// 菜单查询
const handleQuery = () => {
}
// 菜单字段重置
const handleReset = () => {
    menuQueryRef.value.resetFields()
}

// TODO 以上是菜单字段定义和方法 ======

// 新建父/子菜单
const handleCreate = () => {
}

// 创建菜单列表
const menuList = ref([])

// 新增子菜单
const handleOneCreate = () => {
}

// 定义columns菜单
const columns = [
    {
        label: '菜单名称',
        prop: 'menuName',
        width: '180'
    }, {
        label: '图标',
        prop: 'icon',
    }, {
        label: '菜单类型',
        prop: 'menuType'
    }, {
        label: '权限标识',
        prop: 'menuCode'
    }, {
        label: '路由地址',
        prop: ''
    }
]
</script>


<style scoped lang="scss">

</style>