<!--菜单页面-->
<template>
  <div class="app-container">
    <!--  查询条件  -->
    <div class="filter-container">
      <span class="filter-item-first-condition">角色名称: </span>
      <el-input v-model="filter.roleNameCn" class="filter-item" style="width: 200px;" placeholder="请输入角色名称" />
      <!-- 操作菜单  -->
      <el-button
        class="filter-item filter-btn-first"
        icon="el-icon-search"
        type="primary"
        @click="searchFunc"
      >
        查询
      </el-button>
      <el-button class="filter-item filter-btn" icon="el-icon-edit" type="primary" @click="addRole">
        新增
      </el-button>
    </div>
    <!-- 表格  -->
    <el-table
      ref="table"
      style="width: 100%"
      :data="role.roles"
      :height="tableHeight"
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
        min-width="50"
      >
        <template v-slot="scope">
          {{ (role.page - 1) * role.size + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column
        fixed
        label="角色"
        min-width="300"
        prop="roleNameCn"
      />
      <el-table-column
        label="备注"
        min-width="300"
        prop="remark"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        min-width="150"
        prop="createTime"
      />
      <el-table-column
        fixed="right"
        label="操作"
        min-width="150"
      >
        <template v-slot="scope">
          <el-button type="text" size="small" @click="editRole(scope.row)">编辑</el-button>
          <el-button v-if="Number(scope.row.id) > 100" type="text" size="small" @click="deleteRole(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <el-pagination
      :current-page="role.page"
      :page-size="role.size"
      :page-sizes="role.pageSizes"
      :total="role.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--  新增角色弹窗  -->
    <CreateRoleDialog :create-role-dialog.sync="createRoleDialog" />
    <EditRoleDialog :edit-role-dialog.sync="editRoleDialog" :edit-role-info="editRoleInfo" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { pageRole, removeRole } from '@/api/role'

export default {
  name: 'MenuPage',
  components: {
    CreateRoleDialog: () => import('@/views/role/components/CreateRoleDialog'),
    EditRoleDialog: () => import('@/views/role/components/EditRoleDialog'),
  },
  directives: { waves },
  data() {
    return {
      tableHeight: this.$globalVariable.TABLE_HEIGHT,
      // 表格中的角色
      role: {
        roles: [],
        page: 1,
        size: this.$globalVariable.PAGE_SIZES[0],
        total: 0,
        totalPage: 0,
        pageSizes: this.$globalVariable.PAGE_SIZES
      },
      filter: {
        roleNameCn: undefined
      },
      createRoleDialog: false,
      editRoleDialog: false,
      editRoleInfo: undefined,
    }
  },
  mounted() {
    this.tableHeight = this.$globalVariable.TABLE_HEIGHT
    // 优先加载表格数据
    this.loadPageRole()
  },
  methods: {
    searchFunc() {
      // 点击查询按钮
      this.role.page = 1
      this.loadPageRole()
    },
    loadPageRole() {
      const pageParam = {
        page: this.role.page,
        size: this.role.size,
        roleNameCn: this.filter.roleNameCn,
      }
      pageRole(pageParam).then(response => {
        const data = response.data.data
        const content = data.content

        // 修改分页组件
        this.role.page = Number(data.page)
        this.role.size = Number(data.size)
        this.role.total = Number(data.total)
        this.role.totalPage = Number(data.totalPage)

        // 将原先的数据丢弃
        this.role.roles = []

        // 添加到数据集合
        content.forEach((item, index, arr) => {
          const column = {
            id: item.id,
            roleNameCn: item.roleNameCn,
            remark: item.remark,
            createTime: item.createTime,
          }
          this.role.roles.push(column)
        })
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.role.size = val
      this.loadPageRole()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.role.page = val
      this.loadPageRole()
    },
    // 新增角色
    addRole() {
      this.createRoleDialog = true
    },
    // 修改角色
    editRole(row) {
      this.editRoleInfo = row
      this.editRoleDialog = true
    },
    // 删除角色
    deleteRole(id) {
      removeRole(id).then(response => {
        this.$message.success("删除成功")
        this.loadPageRole()
      })
    }
  }

}
</script>
