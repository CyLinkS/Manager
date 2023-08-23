<template>
    <div class="leave-manager">
        <!--查询表单-->
        <div class="query-form">
            <el-form inline :model="queryForm" ref="queryFormRef">
                <el-form-item label="审批状态" prop="applyState">
                    <el-select v-model="queryForm['applyState']">
                        <el-option :value="0" label="全部"></el-option>
                        <el-option :value="1" label="待审批"></el-option>
                        <el-option :value="2" label="审批中"></el-option>
                        <el-option :value="3" label="审批拒绝"></el-option>
                        <el-option :value="4" label="审批通过"></el-option>
                        <el-option :value="5" label="作废"></el-option>
                    </el-select>
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
                <el-button type="primary" size="small" v-has="'role-create'" @click="handleCreate">申请休假</el-button>
            </div>
            <el-table :data="leaveList">
                <el-table-column v-for="item in columns"
                                 :key="item.prop"
                                 :prop="item.prop"
                                 :formatter="item.formatter"
                                 :label="item.label">
                </el-table-column>
                <el-table-column label="操作" width="140">
                    <template #default="scope">
                        <el-button size="small" v-has="'role-edit'" @click="handleQueryTable(scope.row)">查看
                        </el-button>
                        <el-button type="danger" v-has="'role-delete'" size="small"
                                   v-if=" [1,2].includes(scope.row.applyState)"
                                   @click="handleDelete(scope.row)">作废
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--页码-->
            <el-pagination
                class="pagination"
                background
                layout="prev, pager, next"
                :total="Number(pager.total)"
                :page-size="pager.pageSize"
                :current-page="pager.pageNum"
                @current-change="handleCurrentChange"
            />
        </div>
        <!--申请弹窗-->
        <el-dialog title="申请休假" width="70%" v-model="showModel">
            <el-form :model="leaveForm" label-width="120px" ref="dialogFormRef" :rules="rules">
                <el-form-item label="休假类型" prop="applyType">
                    <el-select v-model="leaveForm['applyType']">
                        <el-option :value="1" label="事假"></el-option>
                        <el-option :value="2" label="调休"></el-option>
                        <el-option :value="3" label="年假"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="休假时间" required>
                    <el-row style="width: 100%;">
                        <el-col :span="6">
                            <el-form-item prop="startTime">
                                <el-date-picker
                                    style="width: 100%"
                                    v-model="leaveForm.startTime"
                                    type="date"
                                    placeholder="选择开始日期"
                                    @change="(val) => handleDateChange('startTime', val)"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="1" style="text-align: center">
                            -
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="endTime">
                                <el-date-picker
                                    style="width: 100%"
                                    v-model="leaveForm.endTime"
                                    type="date"
                                    placeholder="选择结束日期"
                                    @change="(val) => handleDateChange('endTime', val)"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="休假时长" prop="leaveTime">
                    <span style="color: red">{{ leaveForm['leaveTime'] }}</span> 天
                </el-form-item>

                <el-form-item label="休假原因" prop="reasons">
                    <el-input type="textarea" :rows="3" placeholder="请输入休假原因"
                              v-model="leaveForm['reasons']"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!--查看弹框-->
        <el-dialog title="申请休假详情" width="50%" v-model="showDetailModel">
            <el-steps :active="activeStep" align-center>
                <el-step title="待审批"/>
                <el-step title="审批中"/>
                <el-step title="审批完成"/>
            </el-steps>
            <el-form label-width="120px" label-suffix=":">
                <el-form-item label="休假类型">
                    <div>{{ detail['applyTypeName'] }}</div>
                </el-form-item>
                <el-form-item label="休假时间">
                    <div>{{ detail.time }}</div>
                </el-form-item>
                <el-form-item label="休假时长">
                    <div>{{ detail.leaveTime }}</div>
                </el-form-item>
                <el-form-item label="休假原因">
                    <div>{{ detail.reasons }}</div>
                </el-form-item>
                <el-form-item label="审批状态">
                    <div>{{ detail['applyStateName'] }}</div>
                </el-form-item>
                <el-form-item label="审批人">
                    <div>{{ detail['curAuditUserName'] }}</div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script setup>
// TODO 查询表单
import {computed, onMounted, reactive, ref} from "vue";
import {leaveListApi, leaveOperate} from "@/utils/api";
import {dayjs} from "element-plus";
import {Message} from "@/utils/ElementUTILS";

const queryForm = reactive({
    applyState: 0
})

// 获取表单的Ref
const queryFormRef = ref(null)

// 表单查询
const handleQuery = () => {}

// 表单重置
const handleReset = () => {
    queryFormRef.value.resetFields()
}

// TODO 下部分 << === 分割线 === >>

// columns
const columns = [
    {
        label: '单号',
        prop: 'orderNo'
    }, {
        label: '休假时间',
        prop: '',
        formatter (row, column, value) {
            return dayjs(row.startTime).format('YYYY-MM-DD') + '到' + dayjs(row.endTime).format('YYYY-MM-DD')
        }
    }, {
        label: '休假时长',
        prop: 'leaveTime'
    }, {
        label: '休假类型',
        prop: 'applyType',
        formatter (row, column, value) {
            return {
                1: '事假',
                2: '调休',
                3: '年假'
            }[value]
        }
    }, {
        label: '休假原因',
        prop: 'reasons'
    }, {
        label: '申请时间',
        prop: 'createTime',
        formatter (row, column, value) {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        }
    }, {
        label: '审批人',
        prop: 'auditUsers'
    }, {
        label: '当前审批人',
        prop: 'curAuditUserName'
    }, {
        label: '审批状态',
        prop: 'applyState',
        formatter (row, column, value) {
            return {
                1: '待审批',
                2: '审批中',
                3: '审批拒绝',
                4: '审批通过',
                5: '作废'
            }[value]
        }
    }
]

// pager
const pager = ref({
    pageNum: 1,
    pageSize: 10,
    total: 10
})

// 改变页码执行事件
const handleCurrentChange = (val) => {
    pager.value.pageNum = val
}

// 弹框的显示/隐藏
const showModel = ref(false)

// 初始化审批列表
const leaveList = ref([])

// 获取申请列表
const getLeaveList = async () => {
    let params = {...queryForm, ...pager.value}
    const {page, list} = await leaveListApi(params)
    leaveList.value = list
    pager.value = page
}

// 执行一次
onMounted(() => {
    getLeaveList()
})

// 申请表单初始化
const leaveForm = ref({
    applyType: 1,
    startTime: '',
    endTime: '',
    leaveTime: 0,
    reasons: ''
})

// 申请休假事件处理
const handleCreate = () => {
    showModel.value = true
    action.value = 'create'
}

// 初始化弹框表单Ref
const dialogFormRef = ref(null)

// 定义提交action
const action = ref('create')

// 弹窗表单提交
const handleSubmit = () => {
    dialogFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                let params = {...leaveForm.value, action: action.value}
                let res = await leaveOperate(params)
                if (res) {
                    Message()
                    showModel.value = false
                    await getLeaveList()
                }
            } catch (err) {
                await Promise.reject(err)
            }
        }
    })
}


// 弹窗时间修改
const handleDateChange = (k, val) => {
    let {startTime, endTime} = leaveForm.value
    if (!startTime || !endTime) return
    if (startTime > endTime) {
        Message('开始日期不能晚于结束日期', 'error')
        leaveForm.value.leaveTime = 0
        setTimeout(() => {
            leaveForm.value[k] = ''
        }, 0)
    } else {
        leaveForm.value.leaveTime = ((endTime - startTime) / (24 * 60 * 60 * 1000)) + 1
    }
}


// 弹窗关闭
const handleClose = () => {
    showModel.value = false
    dialogFormRef.value.resetFields()
}

// 定义弹窗表单提交规则
const rules = {
    applyType: [
        {
            required: true
        }
    ],
    startTime: [
        {
            required: true,
            message: '请选择开始时间',
            trigger: 'blur'
        }
    ],
    endTime: [
        {
            required: true,
            message: '请选择结束时间',
            trigger: 'blur'
        }
    ],
    leaveTime: [
        {
            required: true,
            message: '请输入休假时长',
            trigger: 'blur'
        }
    ],
    reasons: [
        {
            required: true,
            message: '请输入休假原因',
            trigger: 'blur'
        }
    ]
}

// 查看弹框
const showDetailModel = ref(false)

// 定义当前步骤条
const activeStep = computed(() => {
    return detail.value['applyState'] > 2 ? 3 : detail.value['applyState']
})

// 查看弹框定义detail
const detail = ref({})

// 查看休假申请事件处理
const handleQueryTable = (row) => {
    showDetailModel.value = true
    let data = {...row}
    data.applyTypeName = {
        1: '事假',
        2: '调休',
        3: '年假'
    }[data.applyType]
    data.time = dayjs(data.startTime).format('YYYY-MM-DD') + '到' + dayjs(data.endTime).format('YYYY-MM-DD')
    data.applyStateName = {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废'
    }[data.applyState]
    detail.value = data
}

// 作废休假申请
const handleDelete = async (row) => {
    const _id = row._id
    try {
        let params = {_id, action: 'delete'}
        let res = await leaveOperate(params)
        if (res) {
            Message('删除成功')
            showDetailModel.value = false
            await getLeaveList()
        }
    } catch (err) {
        await Promise.reject(err)
    }
}
</script>
<style scoped lang="scss">

</style>