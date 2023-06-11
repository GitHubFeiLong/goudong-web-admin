<!--应用管理-->
<template>
  <div class="app-container">
    <!--  查询条件  -->
    <div class="filter-container">
      <div class="filter-item">
        <span class="filter-item-label">应用名称: </span>
        <el-input v-model="filter.appName" clearable placeholder="请输入" />
      </div>
      <div class="filter-item">
        <span class="filter-item-label">状态: </span>
        <el-select
          v-model="filter.status"
          clearable
        >
          <el-option
            v-for="item in appStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-item-label">创建日期: </span>
        <el-date-picker
          v-model="filter.createTime"
          :picker-options="pickerOptions"
          align="center"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          unlink-panels
          value-format="yyyy-MM-dd"
        />
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
        <el-button class="el-button--small" icon="el-icon-plus" type="primary" @click="dialog.create.creating=true">
          新增
        </el-button>
      </div>
      <div class="right-tool">
        <el-tooltip class="right-tool-btn-tooltip" effect="dark" content="刷新" placement="top">
          <div class="right-tool-btn" @click="load">
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
      border
      :data="app.apps"
      row-key="id"
      style="width: 100%"
      :header-cell-style="{background:'#FAFAFA', color:'#000', height: '30px',}"
      :header-row-class-name="EL_TABLE.size"
      :size="EL_TABLE.size"
    >
      <el-table-column
        width="55"
        type="selection"
        header-align="center"
        align="center"
      />
      <el-table-column
        fixed
        label="序号"
        width="50"
        align="center"
      >
        <template v-slot="scope">
          {{ (app.page - 1) * app.size + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column
        label="应用名称"
        prop="appName"
        sortable
      />
      <el-table-column
        label="应用密钥"
        prop="appSecret"
        sortable
      />
      <el-table-column
        label="状态"
        prop="status"
        align="center"
        sortable
      >
        <template v-slot="scope">
          <span v-if="scope.row.status == 0">待审核</span>
          <span v-else-if="scope.row.status === 1">已通过</span>
          <span v-else>未通过</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        sortable
      />
      <el-table-column
        label="备注"
        prop="remark"
        sortable
        show-overflow-tooltip
      />
      <!--隐藏-->
      <el-table-column
        v-if="false"
        label="id"
        prop="id"
      />
    </el-table>
    <!-- 分页控件 -->
    <el-pagination
      :current-page="app.page"
      :pager-count="app.pagerCount"
      :page-size="app.size"
      :page-sizes="app.pageSizes"
      :total="app.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!--  申请应用弹窗  -->
    <el-dialog title="申请应用" width="600px" :visible.sync="dialog.create.creating" @close="dialog.create.creating = false">
      <el-form ref="createForm" :model="dialog.create.form.data" :rules="dialog.create.form.rules" label-width="80px">
        <el-form-item label="应用名" prop="appName">
          <el-input v-model="dialog.create.form.data.appName" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialog.create.form.data.remark" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateCancel">取 消</el-button>
        <el-button type="primary" @click="dialogCreateSubmit('editUser')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { APP_STATUS_ARRAY, DATE_PICKER_DEFAULT_OPTIONS } from "@/constant/commons";
import { applyAppApi, pageAppApi } from "@/api/app";
import * as validate from "@/utils/validate";
import { simpleCreateUser } from "@/api/user";
import { Message } from "element-ui";

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      appStatus: APP_STATUS_ARRAY,
      filter: {
        appName: undefined,
        status: undefined,
        remark: undefined,
        createTime: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined,
      },
      pickerOptions: DATE_PICKER_DEFAULT_OPTIONS,
      app: {
        apps: [],
        page: 1,
        size: this.$globalVariable.PAGE_SIZES[0],
        pagerCount: this.$globalVariable.PAGER_COUNT,
        total: 0,
        totalPage: 0,
        pageSizes: this.$globalVariable.PAGE_SIZES
      },

      isLoading: false,
      elDropdownItemClass: ['el-dropdown-item--click', undefined, undefined],
      EL_TABLE: {
        // 显示大小
        size: 'medium'
      },

      dialog: {
        create: {
          creating: false,
          form: {
            data: {},
            rules: {
              appName: [
                { required: true, message: '请填写应用名称', trigger: 'blur' },
              ],
            }
          }

        }
      }
    }
  },
  mounted() {
    // 优先加载表格数据
    this.load()
    // 强制渲染，解决表格 固定列后，列错位问题
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    load() {
      this.isLoading = true;
      this.filterTimeHandler();
      const pageParam = {
        page: this.app.page,
        size: this.app.size,
        appName: this.filter.appName,
        status: this.filter.status,
        remark: this.filter.remark,
        startCreateTime: this.filter.startCreateTime,
        endCreateTime: this.filter.endCreateTime,
      }
      pageAppApi(pageParam).then(data => {
        const content = data.content

        // 修改分页组件
        this.app.page = Number(data.page)
        this.app.size = Number(data.size)
        this.app.total = Number(data.total)
        this.app.totalPage = Number(data.totalPage)

        // 将原先的数据丢弃
        this.app.apps = []

        // 添加到数据集合
        content.forEach((item, index, arr) => {
          const column = {
            ...item,
          }

          this.app.apps.push(column)
        })
      }).finally(() => {
        this.isLoading = false;
      })
    },
    // 点击查询按钮
    searchFunc() {
      this.app.page = 1
      this.filterTimeHandler()
      this.load()
    },
    // 点击重置按钮
    resetSearchFilter() {
      // 赋默认值
      this.filter = {
        appName: undefined,
        status: undefined,
        remark: undefined,
        createTime: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined,
      };
    },
    filterTimeHandler() {
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
    // 更改每页显示多少条
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.app.size = val
      this.load()
    },
    // 修改当前页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.app.page = val
      this.load()
    },

    // 弹窗
    // 新增
    dialogCreateCancel() {
      this.dialog.create.creating = false
      this.dialog.create.form.data = {}
    },
    dialogCreateSubmit() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          applyAppApi(this.dialog.create.form.data).then(response => {
            // 保存成功
            Message({
              message: '申请成功,等待审核',
              type: 'success',
            })
            this.dialogCreateCancel()
            this.load();
          })
        } else {
          return false;
        }
      });
    },

  }
}
</script>

<style lang="scss">

</style>
