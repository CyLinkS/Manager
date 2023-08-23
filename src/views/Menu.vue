<template>
    <div class="menu-manager">
        <div class="query-form">
            <el-form inline :model="queryForm" ref="queryFormRef">
                <el-form-item label="菜单名称" prop="userId">
                    <el-input v-model="queryForm['userId']" placeholder="请输入菜单名称"/>
                </el-form-item>
                <el-form-item label="菜单状态" prop="state">
                    <el-select v-model="queryForm.menuState">
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
                <el-button type="primary" size="small" @click="handleCreate(1,'')">新建菜单</el-button>
            </div>
            <el-table :data="menuList" row-key="_id" :tree-props="{ children: 'children' }">
                <el-table-column v-for="item in columns"
                                 :key="item.prop"
                                 :width="item.width"
                                 :prop="item.prop"
                                 :formatter="item.formatter"
                                 :label="item.label">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <!--判断一下按钮是否需要新增-->
                        <el-button v-show="scope.row.menuType === 1" v-has="'menu-create'"
                                   @click="handleCreate(2,scope.row)"
                                   size="small">新增
                        </el-button>
                        <el-button @click="handleOneEdit(scope.row)" v-has="'menu-edit'" size="small">编辑</el-button>
                        <el-button @click="handleOneDelete(scope.row)" v-has="'menu-delete'" type="danger" size="small">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="菜单新增" v-model="showModel">
            <el-form ref="dialogFormRef" :model="menuForm" label-width="120" :rules="rules">
                <el-form-item label="父级菜单" prop="parentId">
                    <el-cascader v-model="menuForm['parentId']"
                                 :options="menuList"
                                 :props="{checkStrictly:true,value:'_id',label:'menuName'}"
                                 clearable/>
                    <span style="margin-left: 20px">注意:未选,默认创建父级菜单</span>
                </el-form-item>
                <el-form-item label="菜单类型" prop="menuType">
                    <el-radio-group v-model="menuForm['menuType']">
                        <el-radio :label="1">菜单</el-radio>
                        <el-radio :label="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="menuForm['menuName']" placeholder="请输入菜单名称"/>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType ===1">
                    <el-input v-model="menuForm['icon']" placeholder="请输入Icon图标"/>
                </el-form-item>
                <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType ===1">
                    <el-input v-model="menuForm['path']" placeholder="请输入路由地址"/>
                </el-form-item>
                <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType ===1">
                    <el-input v-model="menuForm['component']" placeholder="请输入组件路径"/>
                </el-form-item>
                <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType === 2">
                    <el-input v-model="menuForm['menuCode']" placeholder="请输入权限标识"/>
                </el-form-item>
                <el-form-item label="菜单状态" prop="menuState">
                    <el-radio-group v-model="menuForm['menuState']">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="2">停用</el-radio>
                    </el-radio-group>
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
import {nextTick, onMounted, reactive, ref} from "vue";
import {dayjs} from "element-plus";
import {getMenuList, menuSubmit} from "@/utils/api";
import {Message} from "@/utils/ElementUTILS";
import {useUserStore} from "@/stores/user";
import routes from "@/router";
// 获取store中的用户信息
const userStore = useUserStore()

// 查询菜单字段定义
const queryForm = reactive({
    menuState: 1
})

// 获取查询Ref
const queryFormRef = ref(null)

// 菜单查询
const handleQuery = () => {
}
// 菜单字段重置
const handleReset = () => {
    queryFormRef.value.resetFields()
}

// TODO 以上是菜单字段定义和方法 ======


// 定义菜单列表
const menuList = ref([])

// 新建父/子菜单
const handleCreate = (type, row) => {
    action.value = 'add'
    showModel.value = true
    //新增父/子菜单的区别是,新增子菜单要把父级菜单赋值
    if (type === 2) {
        //代表是子菜单新增,要把父级菜单赋值
        menuForm.value.parentId = [...row.parentId, row['_id']].filter(item => item)
    } else {
        menuForm.value.parentId = [null]
    }
}

// 编辑子菜单
const handleOneEdit = (row) => {
    // TODO 编辑的时候会有重置表单初始化问题,请注意
    showModel.value = true
    action.value = 'edit'
    nextTick(() => {
        menuForm.value = {...row}
    })
}
// 删除子菜单
const handleOneDelete = async (row) => {
    try {
        let {_id} = row
        await menuSubmit({_id, action: 'delete'})
        Message('删除成功')
        userStore.updateFn()
        await handleGetMenuList()
    } catch (err) {
        await Promise.reject(err)
    }
}
// 定义columns菜单
const columns = [
    {
        label: '菜单名称',
        prop: 'menuName',
        width: '140'
    }, {
        label: '图标',
        prop: 'icon',
    }, {
        label: '菜单类型',
        prop: 'menuType',
        formatter (row, column, value) {
            return {
                "1": '菜单',
                "2": '按钮'
            }[value]
        }
    }, {
        label: '权限标识',
        prop: 'menuCode'
    }, {
        label: '路由地址',
        prop: 'path'
    }, {
        label: '组件路径',
        prop: 'component'
    }, {
        label: '菜单状态',
        prop: 'menuState',
        formatter (row, column, value) {
            return {
                "1": '正常',
                "2": '停用'
            }[value]
        }
    }, {
        label: '创建时间',
        prop: 'createTime',
        formatter: (row, column, value) => {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
        width: '169'
    }
]

// 获取菜单列表
const handleGetMenuList = async () => {
    try {
        let res
        res = await getMenuList()
        menuList.value = res
    } catch (err) {
        await Promise.reject(err)
    }
}

onMounted(() => {
    handleGetMenuList()
})

// 是否显示dialog
let showModel = ref(false)

// 定义弹出层数据
const menuForm = ref({
    menuState: 1,
    menuType: 1
})

// 弹出层Ref
const dialogFormRef = ref(null)

// 弹出层rule
const rules = {
    menuName: [
        {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
        }
    ]
}

// 弹出层取消提交
const handleClose = () => {
    dialogFormRef.value.resetFields()
    showModel.value = false
}


// 定义操作类型
let action = ref('add')

// 弹出层提交
const handleSubmit = () => {
    dialogFormRef.value.validate(async (valid) => {
        if (!valid) {
            console.log('提交失败')
            return false
        }
        try {
            let params = JSON.parse(JSON.stringify(menuForm.value))
            params.action = action.value
            await menuSubmit(params)
            showModel.value = false
            Message()
            dialogFormRef.value.resetFields()
            await routes.loadAsyncRoutes()
            await handleGetMenuList()
            userStore.updateFn()
        } catch (err) {
            await Promise.reject(err)
        }
    })
}


</script>


<style scoped lang="scss">

</style>