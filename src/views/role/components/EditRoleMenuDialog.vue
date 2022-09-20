<!--编辑角色权限@getCurrentKey="getCurrentKey"-->
<template>
  <el-dialog title="分配权限" width="600px" :visible.sync="visible" @close="close">
    <div style="margin: -15px 0px 15px 0px">
      <el-button size="medium" plain @click="reset">重置</el-button>
      <el-button size="medium" type="primary" plain @click="submit">提交</el-button>
    </div>
    <el-tree
      ref="menuTree"
      :props="props"
      :data="menus"
      :default-checked-keys="defaultCheckedKeys"
      default-expand-all
      node-key="id"
      show-checkbox
    />
  </el-dialog>
</template>

<script>
import { getRoleById, updatePermissions } from '@/api/role'

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
      defaultCheckedKeys: ["1572128238631784455"],
      props: {
        label: 'name',
        children: 'children'
      },
    };
  },
  watch: {
    editRoleMenuDialog() {
      this.visible = this.editRoleMenuDialog;
      if (this.visible) {
        // 查询角色的信息及权限
        getRoleById(this.editRoleMenuInfo.id).then(response => {
          this.menus = response.data.data.permission;
          // this.defaultCheckedKeys = [];
          response.data.data.permission.map((item, index, array) => {
            // this.defaultCheckedKeys.push(...this.getCheckedId(item))
            return item.id
          });
          console.log(this.menus);
        })
      }
    },
  },
  methods: {
    reset() {
      this.$refs.menuTree.setCheckedKeys(this.defaultCheckedKeys)
    },
    submit() {
      const halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys();
      const checkedKeys = this.$refs.menuTree.getCheckedKeys();
      const ids = [];
      ids.push(...halfCheckedKeys, ...checkedKeys);

      // 调用接口
      updatePermissions(this.editRoleMenuInfo.id, ids).then(response => {
        this.$message.success("修改成功");
      })
    },
    close() {
      // 清理数据
      this.defaultCheckedKeys = []
      this.menus = []
      this.$emit("update:editRoleMenuDialog", false)
    },
    // 获取选中的id
    getCheckedId(item) {
      const ids = [];
      if (item.checked && item.checked === true) {
        ids.push(item.id)
        if (item.children) {
          item.children.forEach((i, index, arr) => {
            ids.push(...this.getCheckedId(i));
          })
        }
      }
      return ids;
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
  },
}
</script>
<style lang="scss" scoped>

</style>
