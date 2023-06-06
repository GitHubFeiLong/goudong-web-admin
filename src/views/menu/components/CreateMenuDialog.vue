<!--新增菜单的弹框-->
<template>
  <el-dialog title="新增菜单" width="700px" :visible.sync="visible" @close="close">
    <el-form ref="addMenuForm" :model="menu" :rules="rules" label-width="100px" :inline="true" label-position="right">
      <el-form-item label="上级菜单:" prop="parentId">
        <!--  选择器选项以树形控件展示  -->
        <el-select ref="selectParentMenu" v-model="parentMenu.id" placeholder="请选择上级菜单">
          <el-option :key="parentMenu.id" :value="parentMenu.id" :label="parentMenu.name" hidden />
          <el-tree
            :data="menuData"
            :props="menuProps"
            node-key="id"
            accordion
            highlight-current
            @node-click="handleMenuNodeClick"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单类型:" prop="type">
        <el-radio-group v-model="menu.type">
          <el-radio :label="0">接口</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称:" prop="name">
        <el-input v-model="menu.name" clearable placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="打开方式:" prop="openModel">
        <el-radio-group v-model="menu.openModel">
          <el-radio :label="0">内链</el-radio>
          <el-radio :label="1">外链</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--分隔符-->
      <div class="cutting-line el-divider el-divider--horizontal" />

      <el-form-item label="菜单图标:" prop="remark">
        <el-select v-model="menu.icon" placeholder="请选择菜单图标" class="icon-input" clearable>
          <template #prefix>
            <span style="padding-left: 5px;">
              <i :class="menu.icon" />
            </span>
          </template>
          <el-option
            v-for="item in icons"
            :key="item"
            :label="item"
            :value="item"
          >
            <span><i :class="item" /> {{ item }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="权限标识:" prop="permissionId">
        <el-input v-model="menu.permissionId" placeholder="请输入权限标识" clearable />
      </el-form-item>

      <el-form-item label="路由地址:" prop="path">
        <el-input v-model="menu.path" placeholder="请输入路由地址" clearable />
      </el-form-item>
      <el-form-item label="请求方式:" prop="method">
        <el-select
          v-model="menu.method"
          multiple
          collapse-tags
          placeholder="请选择请求方式"
        >
          <el-option
            v-for="item in methods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="排序号:" prop="sortNum">
        <el-input-number v-model="menu.sortNum" controls-position="right" :min="1" :max="99999" />
      </el-form-item>
      <el-form-item label="是否展示:" prop="hide">
        <el-switch
          v-model="menu.hide"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
    </el-form>
    <el-form :model="menu" :rules="rules" label-width="100px" label-position="right">
      <el-form-item label="菜单元数据:" prop="metadata">
        <el-input v-model="menu.metadata" type="textarea" :rows="5" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" />
  </el-dialog>
</template>

<script>

import { EL_ICONS } from "@/constant/commons";
import { isJSON } from "@/utils/validate";

export default {
  name: 'CreateMenuDialog',
  props: {
    // 弹框
    createMenuDialog: {
      required: true,
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    const validateMetadata = (rule, value, callback) => {
      isJSON(value).then(boo => {
        console.log(boo)
        if (!boo) {
          console.log(1)
          callback(new Error(""));
        } else {
          console.log(2)
          callback();
        }
      })
    };
    return {
      menuData: undefined,
      menuProps: {
        label: 'name',
        children: 'children'
      },
      parentMenu: {
        id: '',
        name: ''
      },
      icons: [],
      methods: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'HEAD', label: 'HEAD' },
        { value: 'PATCH', label: 'PATCH' },
        { value: 'OPTIONS', label: 'OPTIONS' },
        { value: 'TRACE', label: 'TRACE' },
      ],
      visible: false,
      menu: {
        parentId: undefined,
        type: 0,
        name: undefined,
        openModel: 0,
        icon: '',
        permissionId: undefined,
        path: undefined,
        method: undefined,
        sortNum: 0,
        hide: false,
        metadata: undefined,
        remark: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', triangle: 'blur' }
        ],
        remark: [
          { required: false, max: 255, message: '备注限制最多255字符', triangle: 'blur' }
        ],
        sortNum: [
          { required: true, type: 'number', min: 1, max: 99999, message: '请输入排序号', triangle: 'blur' }
        ],
        metadata: [
          { required: false, message: '请输入正确的JSON格式', triangle: 'blur', validator: validateMetadata }
        ]
      }
    };
  },
  watch: {
    createMenuDialog() {
      this.visible = this.createMenuDialog;
      if (this.visible) {
        this.menuData = this.$store.getters.allMenus;

        if (this.icons.length === 0) {
          this.icons = EL_ICONS
        }
      }
    },
  },
  methods: {
    handleMenuNodeClick(data) {
      console.log(data)
      this.parentMenu = {
        id: data.id,
        name: data.name
      }
      this.menu.parentId = data.id
      // 使 input 失去焦点，并隐藏下拉框
      this.$refs.selectParentMenu.blur()
    },
    submitForm(formName) {
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     // addRole(this.role).then(response => {
      //     //   this.$message.success("保存成功")
      //     //   this.visible = false
      //     //   // 调用父组件的方法
      //     //   this.$parent.loadPageRole();
      //     // })
      //   } else {
      //     return false;
      //   }
      // });
    },
    close() {
      this.$emit("update:createMenuDialog", false)
    }
  },
}
</script>
<style lang="scss" scoped>

.cutting-line{
  margin: 8px 0 30px 0;
}
.el-input--medium .el-input__inner{
  width: 270px;
}
.icon-input{
  width: 202px;
}
</style>
