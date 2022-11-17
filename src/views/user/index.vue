<template>
  <div class="app-container">
    <!--  查询条件  -->
    <div class="filter-container">
      <span class="filter-item-first-condition">用户账号: </span>
      <UsernameSelect ref="UsernameSelect" class="filter-item" @getUsername="getUsername" />
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
      <el-button
        class="filter-item filter-btn-first"
        icon="el-icon-search"
        type="primary"
        @click="searchFunc"
      >
        查询
      </el-button>
      <!--不加icon会小一个像素的高度-->
      <el-button class="filter-item filter-btn" icon="el-icon-setting" @click="resetSearchFilter">重置</el-button>
    </div>
    <!--顶部操作栏-->
    <div class="el-table-tool">
      <el-button class="el-button--small" icon="el-icon-plus" type="primary" @click="createUserDialog=true">
        新增
      </el-button>
      <el-button class="el-button--small" icon="el-icon-download" type="primary" @click="exportExcel">
        导出
      </el-button>
    </div>
    <!-- 表格  -->
    <el-table
      ref="table"
      v-loading="isLoading"
      style="width: 100%"
      :data="user.users"
      :height="tableHeight"
      :row-class-name="tableRowClassName"
      :header-cell-style="{background:'#FAFAFA', color:'#000'}"
      border
      @selection-change="selectionChangeFunc"
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
        sortable
      />
      <el-table-column
        label="角色"
        min-width="150"
        prop="roleNameCn"
        sortable
        show-overflow-tooltip
      >
        <template v-slot="scope">
          <span v-for="item in scope.row.roleNameCn.split(',')" :key="item">
            <el-tag size="small">{{ item }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="手机号"
        min-width="90"
        prop="phone"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        label="邮箱"
        min-width="120"
        prop="email"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        label="昵称"
        min-width="120"
        prop="nickname"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        label="账号有效期"
        min-width="115"
        prop="validTime"
        sortable
      />
      <el-table-column
        label="创建时间"
        min-width="115"
        prop="createTime"
        sortable
      />
      <el-table-column
        label="备注"
        min-width="200"
        prop="remark"
        show-overflow-tooltip
      />
      <el-table-column
        label="状态"
        min-width="45"
        prop="enabled"
        align="center"
      >
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.enabled"
            :active-value="false"
            :inactive-value="true"
            @change="changeEnabled(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="165"
        align="center"
      >
        <template v-slot="scope">
          <div class="el-link-parent">
            <a v-if="Number(scope.row.id) > 100" class="el-link el-link--primary" @click="editUser(scope.row)"><i class="el-icon-edit" />修改</a>
            <a v-if="Number(scope.row.id) > 100" class="el-link el-link--primary" @click="resetPassword(scope.row)"><i class="el-icon-key" />重置密码</a>
            <a v-if="Number(scope.row.id) > 100" class="el-link el-link--danger" @click="deleteUser(scope.row)"><i class="el-icon-delete" />删除</a>
          </div>
        </template>
      </el-table-column>
      <!--隐藏-->
      <el-table-column
        v-if="false"
        label="角色id集合"
        min-width="300"
        prop="roleIds"
      />
      <el-table-column
        v-if="false"
        label="头像"
        min-width="300"
        prop="avatar"
      />
    </el-table>
    <!-- 分页控件 -->
    <el-pagination
      :current-page="user.page"
      :pager-count="user.pagerCount"
      :page-size="user.size"
      :page-sizes="user.pageSizes"
      :total="user.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增用户弹框 -->
    <CreateUserDialog :create-user-dialog.sync="createUserDialog" />

    <!-- 编辑用户弹框 -->
    <EditUserDialog :edit-user-dialog.sync="editUserDialog" :edit-user-info="editUserInfo" @closeEditUserDialog="closeEditUserDialog" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { pageUser, deleteUserById, resetPasswordApi, changeEnabledApi } from '@/api/user'
import { exportExcel } from "@/utils/export";
import { exportUser } from "@/api/file";

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
        createTime: undefined,
        startValidTime: undefined,
        endValidTime: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined,
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
      // 被编辑的用户信息
      editUserInfo: undefined,
      isLoading: false,
      // 表格中的用户
      user: {
        users: [],
        page: 1,
        size: this.$globalVariable.PAGE_SIZES[0],
        pagerCount: this.$globalVariable.PAGER_COUNT,
        total: 0,
        totalPage: 0,
        pageSizes: this.$globalVariable.PAGE_SIZES
      },
      checkUserIds: []
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
    // 点击查询按钮
    searchFunc() {
      this.user.page = 1
      this.loadPageUser()
    },
    // 点击重置按钮
    resetSearchFilter() {
      // 清空子组件（用户名下拉）值
      this.$refs.UsernameSelect.clear();
      // 赋默认值
      this.filter = {
        username: undefined,
        validTime: undefined,
        createTime: undefined,
        startValidTime: undefined,
        endValidTime: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined,
      };
    },
    filterTimeHandler() {
      const validTime = this.filter.validTime
      if (validTime && validTime.length > 0) {
        this.filter.startValidTime = this.$moment(validTime[0]).format(this.$globalVariable.DATE_TIME_FORMATTER).toString()
        this.filter.endValidTime = this.$moment(validTime[1])
          .add(1, 'd')
          .subtract(1, 's')
          .format(this.$globalVariable.DATE_TIME_FORMATTER).toString()
      } else {
        this.filter.startValidTime = undefined
        this.filter.endValidTime = undefined
      }

      const createTime = this.filter.createTime
      if (createTime && createTime.length > 0) {
        this.filter.startCreateTime = this.$moment(createTime[0]).format(this.$globalVariable.DATE_TIME_FORMATTER).toString()
        this.filter.endCreateTime = this.$moment(createTime[1])
          .add(1, 'd')
          .subtract(1, 's')
          .format(this.$globalVariable.DATE_TIME_FORMATTER).toString()
      } else {
        this.filter.startCreateTime = undefined
        this.filter.endCreateTime = undefined
      }
    },
    loadPageUser() {
      this.isLoading = true;
      this.filterTimeHandler();
      const pageParam = {
        page: this.user.page,
        size: this.user.size,
        username: this.filter.username,
        startValidTime: this.filter.startValidTime,
        endValidTime: this.filter.endValidTime,
        startCreateTime: this.filter.startCreateTime,
        endCreateTime: this.filter.endCreateTime,
      }
      pageUser(pageParam).then(data => {
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
            remark: item.remark,
            avatar: item.avatar,
          }

          if (item.roles && item.roles.length > 0) {
            column['roleNameCn'] = item.roles.map(m => m.roleNameCn).join()
            column['roleIds'] = item.roles.map(m => m.id)
          }
          this.user.users.push(column)

          this.isLoading = false;
        })
      }).catch(() => {
        this.isLoading = false;
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
      console.log(row, 'row')
      this.editUserInfo = row;
      this.editUserDialog = true;
    },
    resetPassword(row) {
      const userId = row.id;
      if (userId <= 100) {
        this.$message.error("不能操作预置用户")
        return
      }
      this.$confirm('此操作将重置该用户密码, 是否继续?', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPasswordApi(userId).then(data => {
          this.$message.success("重置密码成功")
        })
      }).catch(() => {
        this.$message.info("已取消重置密码");
      })
    },
    closeEditUserDialog() {
      this.editUserDialog = false;
    },
    // 切换激活状态
    changeEnabled(row) {
      const userId = row.id;
      if (userId <= 100) {
        this.$message.error("不能操作预置用户")
        return
      }
      changeEnabledApi(userId).then(data => {
        this.$message.success("修改成功")
      })
    },
    deleteUser(row) {
      const userId = row.id;
      if (userId <= 100) {
        this.$message.error("不能操作预置用户")
        return
      }
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserById(userId).then(data => {
          this.$message.success("删除成功")
          this.loadPageUser()
        })
      }).catch(() => {
        this.$message.info("已取消删除");
      })
    },
    // 复选框勾选事件
    selectionChangeFunc(users) {
      const ids = users.map(m => m.id)
      this.checkUserIds = ids
    },
    // 导出用户
    exportExcel() {
      this.filterTimeHandler();
      // 如果勾选了就导出勾选的
      const data = {
        ids: this.checkUserIds.join(","), ...this.filter
      }
      exportUser(data).then(response => {
        console.log(response)
        exportExcel(response)
      })
    }
  }

}
</script>
