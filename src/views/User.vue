<script setup>
import {onMounted, reactive, ref} from "vue";
import {getUserList, UserDel, getRoleAllList, getDeptListApi, userSubmit} from "@/utils/api";
import {Message} from '@/utils/ElementUTILS'
import {dayjs} from 'element-plus'

// 初始化用户表单对象
const userForm = reactive({
    state: 0
})
// 初始化用户列表数据
const userList = ref([])
// 初始化分页数据
const pager = ref({
    pageNum: 1,
    pageSize: 10
})
// 定义动态表格格式
const columns = ref([
    {
        label: '用户ID',
        prop: 'userId'
    }, {
        label: '用户名',
        prop: 'userName'
    }, {
        label: '用户邮箱',
        prop: 'userEmail'
    }, {
        label: '用户角色',
        prop: 'role',
        formatter (row, column, value) {
            return value = Boolean(value) ? '员工' : '管理员'

        }
    }, {
        label: '用户状态',
        prop: 'state',
        formatter (row, column, value) {
            return {
                1: '在职',
                2: '离职',
                3: '试用期'
            }[value]
        }
    }, {
        label: '注册时间',
        prop: 'createTime',
        formatter (row, column, value) {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
        width: '170'
    }, {
        label: '最后登陆时间',
        prop: 'lastLoginTime',
        formatter (row, column, value) {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
        width: '170'
    },
])
// 获取用户列表
const handleUserList = async () => {
    let params = {...userForm, ...pager.value}
    try {
        const {list, page} = await getUserList(params)
        userList.value = list
        pager.value.total = page.total
    } catch (err) {
        await Promise.reject(err)
    }
}
onMounted(() => {
    handleUserList()
    getDeptList()
    getRoleList()
})
// 查询事件,获取用户列表
const handleQuery = () => {
    handleUserList()
}

// 获取form表单的DOM
const form = ref(null)

// 重置查询表单
const handleReset = () => {
    form.value.resetFields()
}
// 点击触发到第几页
const handleCurrentChange = (cur) => {
    pager.value.pageNum = cur
    handleUserList()
}
// 单个用户删除
const handleOneUserDel = async (row) => {
    try {
        await UserDel({
            userIds: [row['userId']], //可单个删除，也可批量删除
        })
        Message('删除成功')
        await handleUserList()
    } catch (err) {
        await Promise.reject(err)
    }
}

// 定义用户选中的ids
const checkedUserIds = ref([])

// 批量删除用户
const handlePatch = async () => {
    if (checkedUserIds.value.length === 0) {
        Message('请选择要删除的用户', 'error')
        return
    }
    try {
        let res = await UserDel({
            userIds: checkedUserIds.value
        })
        if (res['modifiedCount'] > 0) {
            Message('批量删除成功')
            await handleUserList()
        }
    } catch (err) {
        await Promise.reject(err)
    }

}

// 表格多选
const handleSelectionChange = (val) => {
    let arr = []
    val.map(item => {
        arr.push(item['userId'])
    })
    checkedUserIds.value = arr

}

// 定义弹框数据
const userDialogForm = ref({
    state: 3
})

// 弹框是否显示
const showModel = ref(false)

// 定义表单校验规则
const rules = {
    userName: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
        }
    ],
    userEmail: [
        {
            required: true,
            message: '请输入用户邮箱',
            trigger: 'blur'
        }
    ],
    mobile: [
        {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
        }, {
            pattern: /1\d{10}/,
            message: '请输入正确的手机格式',
            trigger: 'blur'
        }
    ],
    deptId: [
        {
            required: true,
            message: '请输入用户邮箱',
            trigger: 'blur'
        }
    ]
}

// 用户新增
const handleCreate = () => {
    showModel.value = true
    action.value = 'create'
}

// 定义部门列表
const deptList = ref([])
// 获取部门列表
const getDeptList = async () => {
    try {
        let res
        res = await getDeptListApi()
        deptList.value = res
    } catch (err) {
        await Promise.reject(err)
    }
}
// 定义所有角色列表
const roleList = ref([])
// 获取所有角色列表
const getRoleList = async () => {
    try {
        let res
        res = await getRoleAllList()
        roleList.value = res
    } catch (err) {
        await Promise.reject(err)
    }
}

// 定义弹窗Ref
const userDialogFormRef = ref()

// 关闭用户弹窗
const handleClose = () => {
    userDialogFormRef.value.resetFields()
    showModel.value = false
}

// 定义表单提交的行为 创建还是编辑
const action = ref('create')

// 提交弹窗数据
const handleSubmit = () => {
    userDialogFormRef.value.validate(async (valid) => {
        if (valid) {
            //TODO 把响应式转换成普通对象 toRaw ,但是我感觉还是JSON这种方法简单
            let params = JSON.parse(JSON.stringify(userDialogForm.value))
            params.userEmail += '@163.com'
            params.action = action.value
            let res = await userSubmit(params)
            if (res) {
                userDialogFormRef.value.resetFields()
                if (action.value === 'create') {
                    Message('用户创建成功')
                } else {
                    Message('用户编辑成功')
                }
                showModel.value = false
                await handleUserList()
            }
        } else {
            return false
        }
    })
}
// 用户编辑
const handleEdit = (row) => {
    showModel.value = true
    action.value = 'edit'
    setTimeout(() => {
        let params = row
        params.userEmail = params.userEmail.split('@')[0]
        Object.assign(userDialogForm.value, row)
    }, 0)
}
</script>

<template>
    <div class="user-manager">
        <div class="query-form">
            <el-form inline :model="userForm" ref="form">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="userForm['userId']" placeholder="请输入用户ID"/>
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="userForm.userName" placeholder="请输入用户名称"/>
                </el-form-item>
                <el-form-item label="用户状态" prop="state">
                    <el-select v-model="userForm.state">
                        <el-option :value="0" label="所有"></el-option>
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
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
                <el-button type="primary" v-has="'user-create'" size="small" @click="handleCreate">新增</el-button>
                <el-button type="danger" v-has="'user-patch-delete'" size="small" @click="handlePatch">批量删除
                </el-button>
            </div>
            <el-table :data="userList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column v-for="item in columns"
                                 :key="item.prop"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :formatter="item.formatter"
                                 :width="item.width"/>
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button size="small" v-has="'user-edit'" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-popconfirm title="是否确认?"
                                       @confirm="handleOneUserDel(scope.row)"
                                       @cancel="()=>Message('取消删除','error')"
                        >
                            <template #reference>
                                <el-button type="danger" v-has="'user-delete'" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
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
        <el-dialog title="用户新增" v-model="showModel">
            <el-form ref="userDialogFormRef" :model="userDialogForm" label-width="80px" :rules="rules">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="userDialogForm.userName" :disabled="action==='edit'"
                              placeholder="请输入用户名称 "/>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="userDialogForm.userEmail" :disabled="action==='edit'"
                              placeholder="请输入用户邮箱 ">
                        <template #append>
                            @163.com
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="userDialogForm.mobile" placeholder="请输入手机号 "/>
                </el-form-item>
                <el-form-item label="岗位" prop="job">
                    <el-input v-model="userDialogForm['job']" placeholder="请输入岗位 "/>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="userDialogForm.state" placeholder="请选择员工状态">
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统角色" prop="roleList">
                    <el-select v-model="userDialogForm['roleList']" placeholder="请选择用户系统角色" multiple
                               style="width: 100%">
                        <el-option v-for="role in roleList"
                                   :key="role['_id']"
                                   :label="role.roleName"
                                   :value="role['_id']"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptId">
                    <el-cascader
                        v-model="userDialogForm.deptId"
                        placeholder="请选择用户所属部门"
                        :options="deptList"
                        style="width: 50%"
                        :props="{checkStrictly:true,value:'_id',label:'deptName'}"
                        clearable/>
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
    </div>
</template>

<style scoped lang="scss">

</style>