<template>
  <div class="app-container">
    <!--  查询条件  -->
    <div class="filter-container">
      <div class="filter-item">
        <span class="filter-item-label">角色名称: </span>
        <RoleNameSelect ref="RoleNameSelect" clearable @getRoleName="getRoleName" />
      </div>
      <div class="filter-item">
        <span class="filter-item-label">角色标识: </span>
        <el-input v-model="filter.roleName" clearable placeholder="请输入" />
      </div>
      <div class="filter-item">
        <span class="filter-item-label">备注: </span>
        <el-input v-model="filter.remark" clearable placeholder="请输入" />
      </div>
      <div class="filter-item">
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="searchFunc"
        >
          查询
        </el-button>
      </div>
      <div class="filter-item">
        <!--不加icon会小一个像素的高度-->
        <el-button icon="el-icon-setting" @click="resetSearchFilter">重置</el-button>
      </div>
    </div>
    <!--顶部操作栏-->
    <div class="el-table-tool">
      <div class="left-tool">
        <el-button class="el-button--small" icon="el-icon-edit" type="primary" @click="initMenu">初始菜单</el-button>
        <el-button class="el-button--small" icon="el-icon-plus" type="primary" @click="addRole">新增</el-button>
        <el-button class="el-button--small" icon="el-icon-delete" type="danger" @click="deleteRoles">删除</el-button>
        <el-button class="el-button--small" icon="el-icon-upload2">导入</el-button>
        <el-button class="el-button--small" icon="el-icon-download">导出</el-button>
        <!--        <el-button class="el-button&#45;&#45;small" icon="el-icon-upload2" @click="importUserDialog=true">
          导入
        </el-button>
        <el-button class="el-button&#45;&#45;small" icon="el-icon-download" @click="exportExcel">
          导出
        </el-button>-->
      </div>
      <div class="right-tool">
        <el-tooltip class="right-tool-btn-tooltip" effect="dark" content="刷新" placement="top">
          <div class="right-tool-btn" @click="searchFunc">
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
      </div>
    </div>
    <!-- 表格  -->
    <el-table
      ref="table"
      v-loading="isLoading"
      style="width: 100%"
      :data="role.roles"
      row-key="id"
      border
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
        label="序号"
        min-width="50"
      >
        <template v-slot="scope">
          {{ (role.page - 1) * role.size + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column
        fixed
        label="角色名称"
        min-width="300"
        prop="roleNameCn"
        sortable
      />
      <el-table-column
        fixed
        label="角色标识"
        min-width="300"
        prop="roleName"
        sortable
      />
      <el-table-column
        fixed
        label="用户数量"
        min-width="80"
        prop="userNumbers"
        sortable
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
        sortable
      />
      <el-table-column
        fixed="right"
        label="操作"
        min-width="180"
      >
        <template v-slot="scope">
          <div class="el-link-parent">
            <a v-if="Number(scope.row.id) > 100" class="el-link el-link--primary" @click="editRole(scope.row)"><i class="el-icon-edit" />编辑</a>
            <a v-if="Number(scope.row.id) > 100" class="el-link el-link--primary" @click="editRoleMenu(scope.row)"><i class="el-icon-finished" />权限</a>
            <a v-if="Number(scope.row.id) > 100 && scope.row.userNumbers == 0" class="el-link el-link--danger" @click="deleteRole(scope.row.id)"><i class="el-icon-delete" />删除</a>
          </div>
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
    <!--编辑角色弹窗-->
    <EditRoleDialog :edit-role-dialog.sync="editRoleDialog" :edit-role-info="editRoleInfo" />
    <!--编辑角色权限弹窗-->
    <EditRoleMenuDialog :edit-role-menu-dialog.sync="editRoleMenuDialog" :edit-role-menu-info="editRoleMenuInfo" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { deleteRoleByIdsApi, pageRole, removeRole } from '@/api/role'
import { initMenuApi } from '@/api/menu'

import { goudongWebAdminResource } from "@/router/modules/goudong-web-admin-router";
import { isNotEmpty } from "@/utils/assertUtil";

export default {
  name: 'RolePage',
  components: {
    RoleNameSelect: () => import('@/components/Role/RoleNameSelect'),
    CreateRoleDialog: () => import('@/views/role/components/CreateRoleDialog'),
    EditRoleDialog: () => import('@/views/role/components/EditRoleDialog'),
    EditRoleMenuDialog: () => import('@/views/role/components/EditRoleMenuDialog'),
  },
  directives: { waves },
  data() {
    return {
      isLoading: false,
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
        roleNameCn: undefined,
        roleName: undefined,
        remark: undefined,
      },
      // 复选框选中的用户
      checkRoleIds: [],
      createRoleDialog: false, // 创建角色弹窗
      editRoleDialog: false, // 编辑角色弹窗
      editRoleInfo: undefined, // 编辑角色弹窗的数据
      editRoleMenuDialog: false, // 编辑角色权限弹窗
      editRoleMenuInfo: {}, // 编辑角色权限弹窗的数据
      elDropdownItemClass: ['el-dropdown-item--click', undefined, undefined],
      EL_TABLE: {
        // 显示大小
        size: 'medium'
      },
    }
  },
  mounted() {
    // 优先加载表格数据
    this.loadPageRole()
  },
  methods: {
    getRoleName(ev) {
      this.filter.roleNameCn = ev
    },
    searchFunc() {
      // 点击查询按钮
      this.role.page = 1
      this.loadPageRole()
    },
    // 点击重置按钮
    resetSearchFilter() {
      // 清空子组件（用户名下拉）值
      this.$refs.RoleNameSelect.clear();
      // 赋默认值
      this.filter = {};
    },
    loadPageRole() {
      this.isLoading = true;
      const pageParam = {
        page: this.role.page,
        size: this.role.size,
        roleNameCn: this.filter.roleNameCn,
        roleName: this.filter.roleName,
        remark: this.filter.remark,
      }
      pageRole(pageParam).then(data => {
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
            roleName: item.roleName,
            roleNameCn: item.roleNameCn,
            userNumbers: item.userNumbers,
            remark: item.remark,
            createTime: item.createTime,
          }
          this.role.roles.push(column)
        })
      }).finally(() => {
        this.isLoading = false;
      })
    },
    // 复选框勾选事件
    selectionChangeFunc(roles) {
      const ids = roles.map(m => m.id)
      this.checkRoleIds = ids
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
    // 推送菜单
    initMenu() {
      const menus = [];
      console.log(goudongWebAdminResource)
      goudongWebAdminResource.filter(f => !f.hidden).forEach((item, index, arr) => {
        const obj = this.generate(item);
        menus.push(obj)
      })
      console.log(menus);

      initMenuApi(menus).then(data => {
        this.$message.success("推送成功")
      })
    },
    generate(item) {
      const obj = {
        name: item.name,
        type: item.type,
        openModel: item.openModel,
        path: item.path,
        permissionId: item.permissionId,
        method: item.method,
        metadata: item.meta,
      }
      if (item.meta) {
        if (item.meta.icon) {
          obj.icon = item.meta.icon
        }
        if (!item.meta.title) {
          obj.metadata.title = obj.name
        }

        obj.metadata = JSON.stringify(obj.metadata)
      }
      // 菜单（组件）未单独配置组件路由
      if (item.type === 1 && !item.componentPath) {
        obj.componentPath = item.path
      }

      if (item.children) {
        // 子元素
        obj.children = [];
        item.children.forEach((i, index, arr) => {
          obj.children.push(this.generate(i));
        })
      }
      return obj;
    },
    // 新增角色
    addRole() {
      this.createRoleDialog = true
    },
    // 批量删除用户
    deleteRoles() {
      const ids = this.checkRoleIds;
      isNotEmpty(ids, () => this.$message.warning("请勾选需要删除的角色"))
        .then(() => {
          this.$confirm('此操作将永久删除所选角色, 是否继续?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteRoleByIdsApi({ ids: this.checkRoleIds.join(",") }).then(data => {
              this.$message.success("删除成功")
              this.loadPageUser()
            })
          }).catch(() => {
            this.$message.info("已取消删除");
          })
        }).catch(() => {});
    },
    // 修改角色
    editRole(row) {
      this.editRoleInfo = row
      this.editRoleDialog = true
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRole(id).then(response => {
          this.$message.success("删除成功")
          this.loadPageRole()
        })
      }).catch(() => {
        this.$message.info("已取消删除");
      })
    },
    // 设置权限
    editRoleMenu(row) {
      this.editRoleMenuInfo = row
      this.editRoleMenuDialog = true
    }
  }

}
</script>
