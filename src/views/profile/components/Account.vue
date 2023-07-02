<template>
  <el-form ref="changePassword" :model="user" :rules="changePasswordRules">
    <el-form-item label="Name" prop="name">
      <el-input v-model.trim="user.name" disabled />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model.trim="user.password" :type="passwordType" show-password placeholder="请输入8~20位包含数字、字母、符号组合的强密码" />
    </el-form-item>
    <el-form-item label="Confirm Password" prop="repassword">
      <el-input v-model.trim="user.repassword" :type="passwordType" show-password placeholder="请确认密码" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { changeOwnPassword, simpleCreateUser } from "@/api/user";
import * as validate from "@/utils/validate";
import { password, strongPassword } from "@/utils/validate";
import { Message } from "element-ui";

export default {
  name: 'Account',
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          password: '',
          repassword: '',
        }
      }
    }
  },
  data() {
    return {
      passwordType: 'password',
      changePasswordRules: {
        password: [
          { required: true, validator: validate.strongPassword, trigger: 'blur' },
        ],
        repassword: [
          { required: true, validator: validate.strongPassword, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    submit() {
      this.$refs.changePassword.validate((valid) => {
        if (valid) {
          if (this.user.password !== this.user.repassword) {
            this.$message.error("两次输入的密码不匹配")
            return;
          }
          changeOwnPassword(this.user.password).then(data => {
            if (data) {
              this.$message.success("修改成功")
            } else {
              this.$message.error("修改失败")
            }
          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
