<template>
  <div class="app-container">
    <!--  查询条件  -->
    <div class="filter-container">
      <span class="filter-item-first-condition">用户账号: </span>
      <UsernameSelect class="filter-item" @getUsername="getUsername" />
      <span class="filter-item-condition">有效日期: </span>
      <el-date-picker
        v-model="filter.validTime"
        :picker-options="pickerOptions"
        align="center"
        class="filter-item"
        end-placeholder="结束日期"
        range-separator="至"
        start-placeholder="开始日期"
        type="daterange"
        unlink-panels
        value-format="yyyy-MM-dd"
      />
      <span class="filter-item-condition">创建日期: </span>
      <el-date-picker
        v-model="filter.createTime"
        :picker-options="pickerOptions"
        align="center"
        class="filter-item"
        end-placeholder="结束日期"
        range-separator="至"
        start-placeholder="开始日期"
        type="daterange"
        unlink-panels
        value-format="yyyy-MM-dd"
      />

      <!-- 操作菜单  -->
      <el-button
        v-waves
        class="filter-item filter-btn-first"
        icon="el-icon-search"
        type="primary"
        @click="loadPageUser"
      >
        查询
      </el-button>
      <!-- @click="addUser"-->
      <el-button class="filter-item filter-btn" icon="el-icon-edit" type="primary" @click="createUserDialog=true">
        新增
      </el-button>
    </div>
    <!-- 表格  -->
    <el-table
      ref="table"
      style="width: 100%"
      :data="user.users"
      :height="tableHeight"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        min-width="55"
        type="selection"
        header-align="center"
        align="center"
      />
      <el-table-column
        fixed
        label="序号"
        min-width="55"
      >
        <template v-slot="scope">
          {{ (user.page - 1) * user.size + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column
        fixed
        label="用户名"
        min-width="100"
        prop="username"
      />
      <el-table-column
        label="角色"
        min-width="120"
        prop="roleNameCn"
        show-overflow-tooltip
      />
      <el-table-column
        label="手机号"
        min-width="90"
        prop="phone"
        show-overflow-tooltip
      />
      <el-table-column
        label="邮箱"
        min-width="120"
        prop="email"
        show-overflow-tooltip
      />
      <el-table-column
        label="昵称"
        min-width="120"
        prop="nickname"
        show-overflow-tooltip
      />
      <el-table-column
        label="有效期"
        min-width="150"
        prop="validTime"
      />
      <el-table-column
        label="创建时间"
        min-width="150"
        prop="createTime"
      />
      <el-table-column
        label="备注"
        min-width="300"
        prop="remark"
        show-overflow-tooltip
      />
      <el-table-column
        fixed="right"
        label="操作"
        min-width="150"
      >
        <template v-slot="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="editUser(scope.row)" >编辑</el-button>
          <el-button v-if="scope.row.id !== '1'" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <el-pagination
      :current-page="user.page"
      :page-size="user.size"
      :page-sizes="user.pageSizes"
      :total="user.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增用户弹框 -->
    <CreateUserDialog :create-user-dialog.sync="createUserDialog" />

    <!-- 新增用户弹框 -->
    <EditUserDialog :edit-user-dialog.sync="editUserDialog" :user-id="editUserId" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { pageUser } from '@/api/user'

export default {
  name: 'UserPage',
  directives: { waves },
  components: {
    UsernameSelect: () => import('@/components/User/UsernameSelect'),
    CreateUserDialog: () => import('@/views/user/components/CreateUserDialog'),
    EditUserDialog: () => import('@/views/user/components/EditUserDialog')
  },
  data() {
    return {
      tableHeight: this.$globalVariable.TABLE_HEIGHT,
      filter: {
        username: undefined,
        validTime: undefined,
        createTime: undefined
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 新增用户 子组件新增用户 弹框显示变量
      createUserDialog: false,
      // 修改用户 子组件弹框 弹框显示变量
      editUserDialog: false,
      // 被编辑的用户id
      editUserId: undefined,
      // 表格中的用户
      user: {
        users: [],
        page: 1,
        size: this.$globalVariable.PAGE_SIZES[0],
        total: 0,
        totalPage: 0,
        pageSizes: this.$globalVariable.PAGE_SIZES
      }
    }
  },
  mounted() {
    this.tableHeight = this.$globalVariable.TABLE_HEIGHT
    // 优先加载表格数据
    this.loadPageUser()
    // 强制渲染，解决表格 固定列后，列错位问题
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    getUsername(ev) {
      this.filter.username = ev
    },
    loadPageUser() {
      const pageParam = {
        page: this.user.page,
        size: this.user.size,
        username: this.filter.username
      }

      // 参数解析
      const validTime = this.filter.validTime
      if (validTime && validTime.length > 0) {
        pageParam.validTime = undefined
        pageParam['startValidTime'] = this.$moment(validTime[0]).format(this.$globalVariable.DATE_TIME_FORMATTER).toString()
        pageParam['endValidTime'] = this.$moment(validTime[1])
          .add(1, 'd')
          .subtract(1, 's')
          .format(this.$globalVariable.DATE_TIME_FORMATTER).toString()
      }

      const createTime = this.filter.createTime
      if (createTime && createTime.length > 0) {
        pageParam.createTime = undefined
        pageParam['startCreateTime'] = this.$moment(createTime[0]).format(this.$globalVariable.DATE_TIME_FORMATTER).toString()
        pageParam['endCreateTime'] = this.$moment(createTime[1])
          .add(1, 'd')
          .subtract(1, 's')
          .format(this.$globalVariable.DATE_TIME_FORMATTER).toString()
      }

      pageUser(pageParam).then(response => {
        const data = response.data.data
        const content = data.content

        // 修改分页组件
        this.user.page = Number(data.page)
        this.user.size = Number(data.size)
        this.user.total = Number(data.total)
        this.user.totalPage = Number(data.totalPage)

        // 将原先的数据丢弃
        this.user.users = []

        // 添加到数据集合
        content.forEach((item, index, arr) => {
          const column = {
            id: item.id,
            username: item.username,
            phone: item.phone,
            email: item.email,
            nickname: item.nickname,
            validTime: item.validTime,
            createTime: item.createTime,
            remark: item.remark
          }

          if (item.roles && item.roles.length > 0) {
            column['roleNameCn'] = item.roles.map(m => m.roleNameCn).join()
          }

          this.user.users.push(column)
        })
      })
    },
    tableRowClassName({ row, rowIndex }) {
      // 最近一周创建的显示绿色
      if (row.createTime) {
        const diff = this.$moment(new Date())
          .diff(this.$moment(row.createTime).format(this.$globalVariable.DATE_TIME_FORMATTER), 'days')
        if (diff >= 0 && diff <= 7) {
          return 'success-row'
        }
      }
      // 一个月内过期的账号的显示黄色
      if (row.validTime) {
        const diff = this.$moment(new Date())
          .diff(this.$moment(row.validTime).format(this.$globalVariable.DATE_TIME_FORMATTER), 'days')
        if (diff >= 0 && diff <= 30) {
          return 'warning-row'
        }
      }
      // 其它不显示颜色
      return ''
    },
    addUser() {
      this.$router.push({ path: '/user/create-user', query: this.otherQuery })
      // this.$router.push({ path: '/user/page/create-user' })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.user.size = val
      this.loadPageUser()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.user.page = val
      this.loadPageUser()
    },
    editUser(row) {
      this.editUserId = row.id;
      this.editUserDialog = true;
    }
  }

}
</script>
