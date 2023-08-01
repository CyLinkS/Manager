<script setup>
import {onMounted, reactive, ref} from "vue";
import {getUserList, UserDel} from "@/utils/api";
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
        formatter(row, column, value) {
            return value = Boolean(value) ? '管理员' : '员工'

        }
    }, {
        label: '用户状态',
        prop: 'state',
        formatter(row, column, value) {
            return {
                1: '在职',
                2: '离职',
                3: '试用期'
            }[value]
        }
    }, {
        label: '注册时间',
        prop: 'createTime',
        formatter(row, column, value) {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        }
    }, {
        label: '最后登陆时间',
        prop: 'lastLoginTime',
        formatter(row, column, value) {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        }
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
            userIds: [row['userId']]
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
        if (res['nModified'] > 0) {
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
</script>

<template>
    <div class="user-manager">
        <div class="query-form">
            <el-form inline :model="userForm" ref="form">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="userForm.userId" placeholder="请输入用户ID"/>
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
                <el-button type="primary" size="small">新增</el-button>
                <el-button type="danger" size="small" @click="handlePatch">批量删除</el-button>
            </div>
            <el-table :data="userList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column v-for="item in columns"
                                 :key="item.prop"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :formatter="item.formatter"
                />
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button size="small">编辑</el-button>
                        <el-popconfirm title="是否确认?"
                                       @confirm="handleOneUserDel(scope.row)"
                                       @cancel="()=>Message('取消删除','error')"
                        >
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
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
    </div>
</template>

<style scoped lang="scss">

</style>