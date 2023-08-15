<template>
    <!--查询表单-->
    <div class="query-form">
        <el-form inline :model="queryForm" ref="queryFormRef">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="queryForm['roleName']" placeholder="请输入角色名称"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!--数据表格-->
    <div class="base-table">
        <div class="action">
            <el-button type="primary" size="small">创建角色</el-button>
        </div>
        <el-table :data="roleList" row-key="_id">
            <el-table-column v-for="item in columns"
                             :key="item._id"
                             :label="item.label">
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="small">编辑</el-button>
                    <el-button type="primary" size="small">设置权限</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {dayjs} from "element-plus";
import {getRoleList} from "@/utils/api";
// 查询字段定义
const queryForm = ref([])
// 查询方法
const handleQuery = () => {}
// 重置
const handleReset = () => {}
//TODO 以下是数据
// 定义columns菜单
const columns = [
    {
        label: '角色名称',
        prop: 'roleName'
    }, {
        label: '备注',
        prop: 'remark',
    }, {
        label: '权限列表',
        prop: 'codeList'
    }, {
        label: '创建时间',
        prop: 'createTime',
        formatter: (row, column, value) => {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
        width: '169'
    }
]
// 角色列表初始化定义
const roleList = ref([])
// 获取角色列表
const handleGetRoleList = async () => {
    let res
    res = await getRoleList(queryForm.value)
    const {list, page} = res
    // roleList.value = list
}
onMounted(() => {
    handleGetRoleList()
})
</script>
<style scoped lang="scss">

</style>