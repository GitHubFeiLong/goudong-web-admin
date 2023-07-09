<!--修改用户的弹框-->
<template>
  <el-dialog title="编角色" width="600px" :visible.sync="visible" @close="close">
    <el-form ref="editRoleForm" :model="role" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="roleNameCn">
        <el-input v-model="role.roleNameCn" clearable disabled />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="role.remark" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('editRoleForm')">重 置</el-button>
      <el-button type="primary" @click="submitForm('editRoleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editRole } from '@/api/role'

export default {
  name: 'EditUserDialog',
  props: {
    // 弹框
    editRoleDialog: {
      required: true,
      type: Boolean,
      default: function() {
        return false
      }
    },
    editRoleInfo: {
      required: false,
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      visible: false,
      role: {
        roleNameCn: '',
        remark: '',
      },
      rules: {
        roleNameCn: [
          { required: true, min: 1, max: 64, message: '角色名称限制1~64字符', trigger: 'blur' },
        ],
        remark: [
          { required: false, max: 255, message: '备注限制最多255字符', triangle: 'blur' }
        ]
      }
    };
  },
  watch: {
    editRoleDialog() {
      this.visible = this.editRoleDialog;
      if (this.visible) {
        this.role = {
          id: this.editRoleInfo.id,
          roleNameCn: this.editRoleInfo.roleNameCn,
          remark: this.editRoleInfo.remark,
        }
      } else {
        this.role = {
          id: undefined,
          roleNameCn: undefined,
          remark: undefined,
        }
      }
    },
  },
  methods: {
    resetForm(formName) {
      this.role = {
        id: undefined,
        roleNameCn: undefined,
        remark: undefined,
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editRole(this.role).then(data => {
            this.$message.success("保存成功")
            // 关闭弹框
            this.close();
            // 刷新列表
            this.$parent.loadPageRole();
          })
        } else {
          return false;
        }
      });
    },
    close() {
      // 表单清空
      // this.$refs.editUser.resetFields();
      this.$emit("update:editRoleDialog", false)
    },
  },
}
</script>
<style>
/*动态显示和隐藏头像上传*/
.hidden{
  display: none;
}
</style>
