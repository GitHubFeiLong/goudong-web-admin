<!--新增用户的弹框-->
<template>
  <el-dialog title="新增用户" width="600px" :visible.sync="visible" @close="close">
    <el-form ref="user" :model="user" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="user.email" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <RoleSelect :role-multiple="roleSelect.roleMultiple" @getRoles="getRoles" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('user')">重 置</el-button>
      <el-button type="primary" @click="submitForm('user')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as validate from '@/utils/validate'
import { simpleCreateUser } from '@/api/user'
import { Message } from "element-ui"

export default {
  name: 'CreateUserDialog',
  components: {
    RoleSelect: () => import('@/components/User/RoleSelect')
  },
  props: {
    // 弹框
    createUserDialog: { required: true, type: Boolean, default: false }
  },
  data() {
    return {
      visible: false,
      user: {
        username: '',
        phone: '',
        email: '',
        roleIds: [],
      },
      rules: {
        username: [
          { required: true, validator: validate.username, trigger: 'blur' },
        ],
        phone: [
          { required: true, validator: validate.phone, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validate.email, trigger: 'blur' }
        ],
        roleIds: [
          { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'blur' }
        ],
      },
      roleSelect: {
        roleMultiple: true,
      }
    };
  },
  watch: {
    // 监听 createUserDialog
    createUserDialog() {
      this.visible = this.createUserDialog;
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          simpleCreateUser(this.user).then(response => {
            // 保存成功
            Message({
              message: '保存成功',
              type: 'success',
            })
            this.visible = false
            // 调用父组件的方法
            this.$parent.loadPageUser();
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName, "formName")
      this.$refs[formName].resetFields();
    },
    // 获取子组件的角色
    getRoles(roleIds) {
      this.user.roleIds = roleIds;
    },
    close() {
      this.$emit("update:createUserDialog", false)
    }
  },
}
</script>
<style lang="scss" scoped>

</style>
