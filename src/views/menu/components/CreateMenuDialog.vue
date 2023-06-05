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
      <el-form-item label="菜单类型:" prop="remark">
        <el-radio-group v-model="menu.remark">
          <el-radio :label="0">接口</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称:" prop="remark">
        <el-input v-model="menu.remark" clearable placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="菜单图标:" prop="remark">
        <el-select v-model="menu.icon" placeholder="请选择活动区域">
          <el-option
            v-for="item in icons"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <!--分隔符-->
      <div class="cutting-line el-divider el-divider--horizontal" />
      <el-form-item label="路由地址" prop="remark">
        <el-input v-model="menu.remark" placeholder="请输入路由地址" clearable />
      </el-form-item>
      <el-form-item label="请求方式" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>

      <el-form-item label="排序号" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>
      <el-form-item label="是否展示" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>

      <el-form-item label="菜单元数据" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" />
  </el-dialog>
</template>

<script>

import { EL_ICONS } from "@/constant/commons";

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
      visible: false,
      menu: {
        parentId: undefined,
        icon: '',
        remark: '',
      },
      rules: {
        remark: [
          { required: false, max: 255, message: '备注限制最多255字符', triangle: 'blur' }
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
</style>
