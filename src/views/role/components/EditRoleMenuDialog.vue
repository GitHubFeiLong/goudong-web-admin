<!--编辑角色权限-->
<template>
  <el-dialog title="分配权限" width="600px" :visible.sync="visible" @close="close">
    <el-tree
      :props="props"
      :data="menus"
      node-key="label"
      show-checkbox
      @check-change="handleCheckChange"
    />
  </el-dialog>
</template>

<script>
import { addRole } from '@/api/role'
import goudongWebAdminRouter from '@/router/modules/goudong-web-admin-router'

export default {
  name: 'EditRoleMenuDialog',
  props: {
    // 弹框
    editRoleMenuDialog: {
      required: true,
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 角色信息
    editRoleMenuInfo: {
      required: true,
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      visible: false,
      menus: [],
      props: {
        label: 'label',
        children: 'children'
      },
      count: 1
    };
  },
  watch: {
    editRoleMenuDialog() {
      this.visible = this.editRoleMenuDialog;
      if (this.visible) {
        const data = [];
        goudongWebAdminRouter.forEach((item, index, arr) => {
          const obj = this.demo(item);
          data.push(obj)
          console.log(item);
        })
        console.log(data)
        this.menus = data;
      }
    },
  },
  methods: {
    close() {
      this.$emit("update:editRoleMenuDialog", false)
    },
    demo(item) {
      const obj = { label: item.name };
      if (item.children) {
        // 子元素
        obj.children = [];
        item.children.forEach((i, index, arr) => {
          obj.children.push(this.demo(i));
        })
      }
      return obj;
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleNodeClick(data) {
      console.log(data);
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
