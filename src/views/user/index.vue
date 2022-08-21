<template>
  <div class="app-container">
    <!--  查询条件  -->
    <div class="filter-container">
      <span class="filter-item-first-condition">用户账号: </span>
      <el-select
        v-model="filter.username"
        :loading="filter.loading"
        :remote-method="loadMoreUsername"
        allow-create
        class="filter-item"
        clearable
        filterable
        placeholder="请输入用户名"
        remote
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="item in usernameFilter.usernames"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
      <el-button v-waves
                 class="filter-item filter-btn-first"
                 icon="el-icon-search"
                 type="primary"
                 @click="loadPageUser" >
        查询
      </el-button>
<!--      <el-button class="filter-item filter-btn" icon="el-icon-edit" style="margin-left: 10px;" type="primary" @click="addUserData.isShow=true">-->
      <el-button class="filter-item filter-btn" icon="el-icon-edit" style="margin-left: 10px;" type="primary" @click="addUser">
        新增
      </el-button>
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item filter-btn" type="primary" icon="el-icon-download" @click="exportExcel">
              导出
            </el-button>-->
    </div>
    <!-- 表格  -->
    <el-table
      :data="user.users"
      :height="tableHeight"
      :row-class-name="tableRowClassName"
      border
      style="width: 100%"
    >
      <el-table-column
        min-width="55"
        type="selection"
      />
      <el-table-column
        fixed
        label="用户名"
        min-width="150"
        prop="username"
      />
      <el-table-column
        label="角色"
        min-width="120"
        prop="roleNameCn"
      />
      <el-table-column
        label="手机号"
        min-width="90"
        prop="phone"
      />
      <el-table-column
        label="邮箱"
        min-width="120"
        prop="email"
      />
      <el-table-column
        label="昵称"
        min-width="120"
        prop="nickname"
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
      />
      <el-table-column
        fixed="right"
        label="操作"
        min-width="150">
        <template v-slot="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
          <el-button v-if="scope.row.id !== '1'" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <el-pagination
      :current-page="user.currentPage"
      :page-size="user.pageSize"
      :page-sizes="user.pageSizes"
      :total="user.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      title="提示"
      :visible.sync="addUserData.isShow"
      width="30%"
      :before-close="handleClose">
      <AddUser />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import CreateUser from "./components/CreateUser";
import {pageUser, pageUserByField} from '@/api/user'

export default {
  name: 'UserPage',
  components: {
    CreateUser
  },
  directives: {waves},
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

      // 用户账号列表
      usernameFilter: {
        usernames: [],
        loading: false,
        page: 1,
        size: 10
      },
      // 表格中的用户
      user: {
        users: [],
        currentPage: 1,
        pageSize: this.$globalVariable.PAGE_SIZES[0],
        total: 0,
        totalPage: 0,
        pageSizes: this.$globalVariable.PAGE_SIZES
      },
      addUserData: {
        isShow: false
      }
    }
  },
  mounted() {
    this.tableHeight = this.$globalVariable.TABLE_HEIGHT
    // 优先加载表格数据
    this.loadPageUser()
    this.loadMoreUsername(this.filter.username)
  },
  methods: {
    handleRolesChange() {
      this.$router.push({path: '/permission/index?' + +new Date()})
    },
    loadPageUser() {
      const pageParam = {
        page: this.user.currentPage,
        size: this.user.pageSize,
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
        this.user.currentPage = Number(data.pageNumber)
        this.user.pageSize = Number(data.pageSize)
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
    loadMoreUsername(usernamePattern) {
      if (usernamePattern !== '') {
        this.usernameFilter.loading = true
        const page = {page: this.usernameFilter.page, size: this.usernameFilter.size, username: usernamePattern}
        pageUserByField(page).then(response => {
          this.loading = false
          const content = response.data.data.content
          if (content && content.length > 0) {
            // 将value使用逗号拼接起来，用于去重。
            const existsUsernames = this.usernameFilter.usernames.map((item) => {
              return item.value
            }).join()
            content.forEach((user, index, arr) => {
              if (existsUsernames.indexOf(user.username) === -1) {
                this.usernameFilter.usernames.push({value: user.username, label: user.username})
              }
            })
          }
        }).catch(err => {
          console.warn('err', err)
        })
      } else {
        this.usernameFilter.usernames = []
      }
    },
    tableRowClassName({row, rowIndex}) {
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
    exportExcel() {

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.user.pageSize = val
      this.loadPageUser()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.user.currentPage = val
      this.loadPageUser()
    }
  }

}
</script>
