<!--新增角色的弹框-->
<template>
  <el-dialog title="新增角色" width="600px" :visible.sync="visible" @close="close">
    <el-form ref="addRoleForm" :model="role" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="roleNameCn">
        <el-input v-model="role.roleNameCn" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="role.remark" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('addRoleForm')">重 置</el-button>
      <el-button type="primary" @click="submitForm('addRoleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRole } from '@/api/role'

export default {
  name: 'CreateRoleDialog',
  props: {
    // 弹框
    createRoleDialog: {
      required: true,
      type: Boolean,
      default: function() {
        return false;
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
    createRoleDialog() {
      this.visible = this.createRoleDialog;
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addRole(this.role).then(response => {
            this.$message.success("保存成功")
            this.visible = false
            // 调用父组件的方法
            this.$parent.loadPageRole();
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    close() {
      this.$emit("update:createRoleDialog", false)
    }
  },
}
</script>
<style lang="scss" scoped>

</style>
