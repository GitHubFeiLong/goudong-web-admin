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
      <div class="left-tool">
        <el-button class="el-button--small" icon="el-icon-plus" type="primary" @click="createUserDialog=true">
          新增
        </el-button>
        <el-button class="el-button--small" icon="el-icon-delete" type="danger" @click="deleteUsers">
          删除
        </el-button>
        <el-button class="el-button--small" icon="el-icon-upload2" @click="importUserDialog=true">
          导入
        </el-button>
        <el-button class="el-button--small" icon="el-icon-download" @click="exportExcel">
          导出
        </el-button>
      </div>
      <div class="right-tool">
        <el-tooltip class="right-tool-btn-tooltip" effect="dark" content="刷新" placement="top">
          <div class="right-tool-btn" @click="loadPageUser">
            <i class="el-icon-refresh-right" />
          </div>
        </el-tooltip>
        <el-tooltip class="right-tool-btn-tooltip" effect="dark" content="密度" placement="top">
          <el-dropdown trigger="click" @command="changeElTableSizeCommand">
            <div class="right-tool-btn">
              <i class="el-icon-s-operation" />
            </div>
            <el-dropdown-menu slot="dropdown" size="small">
              <el-dropdown-item :class="elDropdownItemClass[0]" command="0,medium">默认</el-dropdown-item>
              <el-dropdown-item :class="elDropdownItemClass[1]" command="1,small">中等</el-dropdown-item>
              <el-dropdown-item :class="elDropdownItemClass[2]" command="2,mini">紧凑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
        <el-tooltip class="right-tool-btn-tooltip" effect="dark" content="列设置" placement="top">
          <div class="right-tool-btn">
            <i class="el-icon-setting" />
          </div>
          <!--          <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>-->
        </el-tooltip>
        <el-tooltip class="right-tool-btn-tooltip" effect="dark" content="全屏" placement="top">
          <div class="right-tool-btn">
            <i class="el-icon-full-screen" />
          </div>
        </el-tooltip>
      </div>
    </div>
    <!-- 表格  -->
    <el-table
      ref="table"
      v-loading="isLoading"
      border
      :data="user.users"
      row-key="id"
      :row-class-name="tableRowClassName"
      :header-cell-style="{background:'#FAFAFA', color:'#000', height: '30px',}"
      :header-row-class-name="EL_TABLE.size"
      :size="EL_TABLE.size"
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
        label="昵称"
        min-width="120"
        prop="nickname"
        sortable
        show-overflow-tooltip
      />
      <el-table-column
        label="性别"
        min-width="50"
        prop="sex"
        sortable
      >
        <template v-slot="scope">
          <span v-if="scope.row.sex == 1">男</span>
          <span v-else-if="scope.row.sex === 2">女</span>
          <span v-else-if="scope.row.sex === 0">未知</span>
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
        label="角色"
        min-width="150"
        prop="roleNameCn"
        sortable
        show-overflow-tooltip
      >
        <template v-slot="scope">
          <span v-for="item in scope.row.roleNameCn" :key="item">
            <el-tag size="small">{{ item }}</el-tag>
          </span>
        </template>
      </el-table-column>
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
        label="激活"
        min-width="50"
        prop="enabled"
        align="center"
      >
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.enabled"
            :active-value="true"
            :inactive-value="false"
            :disabled="scope.row.id <= 100"
            @change="changeEnabled(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="锁定"
        min-width="50"
        prop="enabled"
        align="center"
      >
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.locked"
            :active-value="true"
            :inactive-value="false"
            :disabled="scope.row.id <= 100"
            active-color="#F56C6C"
            inactive-color="#C0CCDA"
            @change="changeLocked(scope.row)"
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

    <!--导入-->
    <el-dialog title="导入用户" :visible.sync="importUserDialog" custom-class="el-dialog-import-table">
      <el-upload
        class="el-dialog-import-table-upload"
        action="/api/file/user/import/user"
        drag
        :show-file-list="false"
        :multiple="false"
        :before-upload="beforeUploadUserExcel"
        :on-success="uploadUserExcelSuccess"
        :on-error="uploadUserExcelError"
        :headers="headers"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xls、xlsx文件，<a class="a-download-template" @click="downloadImportUserTemplate">下载模板</a></div>
      </el-upload>
    </el-dialog>
    <!-- 新增用户弹框 -->
    <CreateUserDialog :create-user-dialog.sync="createUserDialog" />

    <!-- 编辑用户弹框 -->
    <EditUserDialog :edit-user-dialog.sync="editUserDialog" :edit-user-info="editUserInfo" @closeEditUserDialog="closeEditUserDialog" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import {
  pageUser,
  deleteUserById,
  resetPasswordApi,
  changeEnabledApi,
  deleteUserByIdsApi,
  changeLockedApi
} from '@/api/user'
import { exportExcel } from "@/utils/export";
import { exportUserApi, exportUserTemplateApi } from "@/api/file";
import { isNotEmpty, isTrue } from "@/utils/assertUtil";
import { beforeUploadExcel } from "@/utils/updateUtil";
import LocalStorageUtil from "@/utils/LocalStorageUtil";
import { BEARER } from "@/constant/HttpHeaderConst";

import * as aes from '@/utils/aes'
import { encrypt } from "@/utils/aes";

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
      // 导入用户
      importUserDialog: false,
      // 新增用户 子组件新增用户 弹框显示变量
      createUserDialog: false,
      // 修改用户 子组件弹框 弹框显示变量
      editUserDialog: false,
      // 被编辑的用户信息
      editUserInfo: undefined,
      isLoading: false,
      elDropdownItemClass: ['el-dropdown-item--click', undefined, undefined],
      EL_TABLE: {
        // 显示大小
        size: 'medium'
      },
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
      // 复选框选中的用户
      checkUserIds: [],
      // 表格属性
      /* tableAttr: {
        columns:[
          {}
        ]
      }*/

      headers: {}, // 请求头
    }
  },
  mounted() {
    // 请求头
    this.headers = {
      Authorization: BEARER + LocalStorageUtil.getAccessToken()
    }
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
            ...item,
          }

          if (item.roles && item.roles.length > 0) {
            column['roleNameCn'] = item.roles.map(m => m.roleNameCn)
            column['roleIds'] = item.roles.map(m => m.id)
          }
          this.user.users.push(column)
        })
      }).finally(() => {
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
    // 修改表格大小
    changeElTableSizeCommand(val) {
      const args = val.split(",");
      const idx = Number(args[0]);
      console.log(args)
      this.elDropdownItemClass.map((value, index, array) => {
        if (index === idx) {
          array[index] = "el-dropdown-item--click";
        } else {
          array[index] = undefined;
        }
      })
      console.log(this.elDropdownItemClass)
      this.elDropdownItemClass[args[0]]
      this.EL_TABLE.size = args[1];
    },
    addUser() {
      this.$router.push({ path: '/user/create-user', query: this.otherQuery })
      // this.$router.push({ path: '/user/page/create-user' })
    },
    // 更改每页显示多少条
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.user.size = val
      this.loadPageUser()
    },
    // 修改当前页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.user.page = val
      this.loadPageUser()
    },
    // 编辑用户
    editUser(row) {
      console.log(row, 'row')
      this.editUserInfo = row;
      this.editUserDialog = true;
    },
    // 充值密码
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
    // 切换锁定状态
    changeLocked(row) {
      const userId = row.id;
      if (userId <= 100) {
        this.$message.error("不能操作预置用户")
        return
      }
      changeLockedApi(userId).then(data => {
        this.$message.success("修改成功")
      })
    },
    // 批量删除用户
    deleteUsers() {
      const ids = this.checkUserIds;
      isNotEmpty(ids, () => this.$message.warning("请勾选需要删除的用户"))
        .then(() => {
          this.$confirm('此操作将永久删除所选用户, 是否继续?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteUserByIdsApi({ ids: this.checkUserIds.join(",") }).then(data => {
              this.$message.success("删除成功")
              this.loadPageUser()
            })
          }).catch(() => {
            this.$message.info("已取消删除");
          })
        }).catch(() => {});
    },
    // 删除单条用户
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
    // 下载模板
    downloadImportUserTemplate() {
      exportUserTemplateApi();
    },
    // 导入用户之前
    beforeUploadUserExcel(file) {
      beforeUploadExcel(file);
    },
    // 导入用户成功
    uploadUserExcelSuccess(data, file, fileList) {
      console.log("上传成功")
    },
    // 上传失败
    uploadUserExcelError(err, file, fileList) {
      // 获取失败的信息
      const errMessage = JSON.parse(err["message"]);
      if (errMessage.clientMessage) {
        this.$message.error(errMessage.clientMessage)
      } else {
        this.$message.error("上传失败，请稍后再试")
      }
    },
    // 导出用户
    exportExcel() {
      this.filterTimeHandler();
      // 如果勾选了就导出勾选的
      const data = {
        ...this.filter,
        ids: this.checkUserIds.join(",")
      }
      exportUserApi(data);
    }
  }
}
</script>

<style lang="scss">

</style>
