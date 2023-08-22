<template>
    <div class="dept-manager">
        <!--查询表单-->
        <div class="query-form">
            <el-form inline :model="queryForm" ref="queryFormRef">
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="queryForm['deptName']" placeholder="请输入部门名称"/>
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
                <el-button type="primary" v-has="'dept-create'" size="small" @click="handleCreate">创建部门</el-button>
            </div>
            <el-table :data="deptList" row-key="_id" :tree-props="{ children: 'children' }" stripe>
                <el-table-column v-for="item in columns"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :formatter="item.formatter"
                                 :key="item.prop">
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" v-has="'dept-edit'" @click="handleEdit(scope.row)" type="primary">编辑
                        </el-button>
                        <el-button size="small" v-has="'dept-delete'" @click="handleDelete(scope.row)" type="danger">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--弹窗-->
        <el-dialog v-model="showModel" title="创建部门" :close-on-click-modal='false'>

            <el-form ref="dialogFormRef" :model="deptForm" label-width="120" :rules="rules">
                <el-form-item label="上级部门" prop="parentId">
                    <el-cascader placeholder="请先选择上级部门"
                                 :props="{checkStrictly:true,value:'_id',label:'deptName'}"
                                 clearable
                                 :options="deptList"
                                 :show-all-levels="true"
                                 v-model="deptForm['parentId']">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="deptForm['deptName']" placeholder="请输入部门名称"/>
                </el-form-item>
                <el-form-item label="部门负责人" prop="user">
                    <el-select v-model="deptForm['user']" placeholder="请选择部门负责人" @change="handleSelectChange">
                        <el-option v-for="item in userList"
                                   :key="item['userId']"
                                   :value="`${item['userId']}/${item.userName}/${item.userEmail}`"
                                   :label="item.userName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人邮箱" prop="userEmail">
                    <el-input v-model="deptForm['userEmail']" placeholder="请输入部门邮箱" disabled/>
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
<script setup>
//TODO 查询表单
import {dayjs} from "element-plus";
import {nextTick, onMounted, ref} from "vue";
import {deptOperate, getAllUserList, getDeptList} from "@/utils/api";
import {Message} from "@/utils/ElementUTILS";

const queryForm = {deptName: ''}
const handleQuery = () => {}
const handleReset = () => {}
//TODO 数据表格

// columns
const columns = [
    {
        label: '部门名称',
        prop: 'deptName'
    }, {
        label: '负责人',
        prop: 'userName'
    }, {
        label: '更新时间',
        prop: 'updateTime',
        formatter: (row, column, value) => {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
    }, {
        label: "创建时间",
        prop: 'createTime',
        formatter: (row, column, value) => {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
    }
]

// 定义弹窗是否显示
const showModel = ref(false)

// 定义action
const action = ref('create')

// 创建部门
const handleCreate = () => {
    action.value = 'create'
    showModel.value = true
}

// 编辑部门
const handleEdit = (row) => {
    action.value = 'edit'
    showModel.value = true
    nextTick(() => {
        Object.assign(deptForm.value, row, {
            user: `${row.userId}/${row.userName}/${row.userEmail}`
        })
    })
}

// 删除部门
const handleDelete = async (row) => {
    let _id = row['_id']
    action.value = 'delete'
    await deptOperate({_id, action: action.value})
    Message('删除成功')
    await handleDeptList()
}

// 定义部门列表
const deptList = ref([])

// 获取部门列表数据
const handleDeptList = async () => {
    try {
        let res
        res = await getDeptList()
        deptList.value = res
    } catch (error) {
        await Promise.reject(error)
    }
}


// 弹窗操作

// 弹窗Ref
const dialogFormRef = ref(null)

// 定义弹窗数据
const deptForm = ref({
    parentId: [null]
})

// 弹窗关闭
const handleClose = () => {
    showModel.value = false
    dialogFormRef.value.resetFields()
}

// 弹窗提交
const handleSubmit = () => {
    dialogFormRef.value.validate(async (valid) => {
        if (valid) {
            let params = {...deptForm.value, action: action.value}
            delete params.user
            try {
                let res = await deptOperate({...params})
                if (res) {
                    showModel.value = false
                    dialogFormRef.value.resetFields()
                    Message()
                    await handleDeptList()
                }
            } catch (error) {
                await Promise.reject(error)
            }
        }
    })
}

// 弹窗表单规则
const rules = {
    parentId: [
        {
            required: true,
            message: '请选择上级部门',
            trigger: 'blur'
        }
    ],
    deptName: [
        {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
        }
    ],
    user: [
        {
            required: true,
            message: '请选择负责人',
            trigger: 'blur'
        }
    ]
}

// 定义弹窗所有用户列表
const userList = ref([])

// 获取所有用户列表
const handleAllUserList = async () => {
    let res
    res = await getAllUserList()
    userList.value = res
}

onMounted(() => {
    handleDeptList()
    handleAllUserList()
})

// 下拉框事件处理
const handleSelectChange = (val) => {
    const [userId, userName, userEmail] = val.split('/')
    Object.assign(deptForm.value, {userId, userName, userEmail})
}
</script>
<style scoped lang="scss">

</style>