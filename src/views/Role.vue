<template>
    <div class="role-manager">
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
                <el-button type="primary" size="small" @click="handleCreate">创建角色</el-button>
            </div>
            <el-table :data="roleList" row-key="_id">
                <el-table-column v-for="item in columns"
                                 :key="item._id"
                                 :prop="item.prop"
                                 :formatter="item.formatter"
                                 :label="item.label">
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" size="small" @click="handlePermission(scope.row)">设置权限</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                background
                layout="prev, pager, next"
                :total="Number(pager.total)"
                :page-size="pager.pageSize"
                @current-change="handleCurrentChange"
            />
        </div>
        <el-dialog v-model="showModel" title="创建角色" :close-on-click-modal='false'>
            <el-form ref="dialogFormRef" :model="roleForm" label-width="120" :rules="rules">
                <el-form-item label="用户角色" prop="roleName">
                    <el-input v-model="roleForm['roleName']" placeholder="请输入角色名称"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="roleForm['remark']" :rows="2" placeholder="请输入备注内容"/>
                </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">
                  确定
                </el-button>
              </span>
            </template>
        </el-dialog>
        <!-- 权限弹框 -->
        <el-dialog v-model="showPermission" title="设置权限" :close-on-click-modal='false'>
            <el-form ref="dialogFormRef" :model="roleForm" label-width="120" :rules="rules">
                <el-form-item label="角色名称">
                    {{ curRoleName }}
                </el-form-item>
                <el-form-item label="选择权限">
                    <!--  权限树  -->
                    <el-tree
                        ref="permissionTree"
                        :data="menuList"
                        show-checkbox
                        node-key="_id"
                        default-expand-all
                        :props="{label:'menuName'}"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="handlePermissionClose">取消</el-button>
                <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
              </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import {nextTick, onMounted, ref} from "vue";
import {dayjs} from "element-plus";
import {getMenuList, getRoleList, roleSubmit, updatePermission} from "@/utils/api";
import {Message} from "@/utils/ElementUTILS";
// 查询字段定义
const queryForm = ref({
    roleName: ''
})
// 查询方法
const handleQuery = () => {}
// 重置
const handleReset = () => {}
//TODO 以下是数据
// 是否显示dialog
let showModel = ref(false)
// 定义分页对象
const pager = ref({
    total: 0,
    pageSize: 10
})
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
    try {
        let params = {...queryForm.value, ...pager.value}
        let res
        res = await getRoleList(params)
        const {list, page} = res
        roleList.value = list
        pager.value = page
    } catch (err) {
        await Promise.reject(err)
    }
}
onMounted(() => {
    handleGetRoleList()
    handleGetMenuList()
})
// 分页处理函数
const handleCurrentChange = () => {}
// 操作行为
const action = ref('create')
// 弹出层Ref定义
const dialogFormRef = ref(null)
// 初始化提交表单
const roleForm = ref({
    roleName: '',
    remark: ''
})
// 定义提交规则
const rules = {
    roleName: [
        {
            required: true,
            trigger: 'blur',
            message: '请输入角色名称'
        }
    ]
}
// 创建角色
const handleCreate = () => {
    action.value = 'create'
    showModel.value = true
}
// 编辑角色
const handleEdit = (row) => {
    action.value = 'edit'
    showModel.value = true
    nextTick(() => {
        Object.assign(roleForm.value, row)
    })
}
// 删除角色
const handleDelete = async (_id) => {
    await roleSubmit({_id, action: 'delete'})
    Message('删除成功')
    await handleGetRoleList()
}
// 表单重置方法
const handleFormReset = () => {
    dialogFormRef.value.resetFields()
}
// 弹出层取消按钮
const handleClose = () => {
    handleFormReset()
    showModel.value = false
}
// 弹出层角色提交按钮事件
const handleSubmit = () => {
    dialogFormRef.value.validate(async (valid) => {
        if (valid) {
            //验证成功提交数据
            try {
                let params = {...roleForm.value, action: action.value}
                await roleSubmit(params)
                handleFormReset()
                Message('提交成功')
                showModel.value = false
                await handleGetRoleList()
            } catch (err) {
                await Promise.reject(err)
            }
        }
    })
}
// 权限弹框
const showPermission = ref(false)
// 当前权限角色名
const curRoleName = ref('')
// 当前权限角色ID
const curRoleId = ref('')
// 定义权限树的Ref
const permissionTree = ref(null)
// 处理权限
const handlePermission = (row) => {
    curRoleName.value = row.roleName
    curRoleId.value = row._id
    showPermission.value = true
    //TODO checkedKeys => 选中的菜单
    let {checkedKeys, halfCheckedKeys} = row['permissionList']
    nextTick(() => {
        permissionTree.value.setCheckedKeys(checkedKeys)
    })
}
// 关闭权限弹框
const handlePermissionClose = () => {
    showPermission.value = false
}
// 权限数据
const menuList = ref([])
// 获取菜单列表填充权限数据
const handleGetMenuList = async () => {
    try {
        let res
        res = await getMenuList()
        menuList.value = res
    } catch (err) {
        await Promise.reject(err)
    }
}
// 权限提交
const handlePermissionSubmit = async () => {
    // TODO 获取选中的节点使用element提供的api来实现
    let nodes = permissionTree.value.getCheckedNodes()
    // TODO 半选中的主菜单 => halfKeys (系统管理/审批管理)
    let halfKeys = permissionTree.value.getHalfCheckedKeys()
    let checkedKeys = []
    let parentKeys = []
    nodes.map(r => {
        if (!r.children) {
            //TODO 没children代表是按钮级别的
            checkedKeys.push(r._id)
        } else {
            //TODO 这是代表按钮往上一层的选中菜单节点(比如用户管理)
            parentKeys.push(r._id)
        }
    })
    let params = {
        _id: curRoleId.value,
        permissionList: {
            checkedKeys,
            halfCheckedKeys: parentKeys.concat(halfKeys)
        }
    }
    try {
        await updatePermission(params)
        Message('权限设置成功')
        showPermission.value = false
    } catch (err) {
        await Promise.reject(err)
    }
}
</script>
<style scoped lang="scss">

</style>