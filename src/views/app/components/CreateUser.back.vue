<template>
  <div class="app-container">
    <div class="form-container">
      <el-form ref="user" :model="user" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="user.phone" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" clearable />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <RoleSelect :role-multiple="roleSelect.roleMultiple" @getRoles="getRoles" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('user')">立即创建</el-button>
          <el-button @click="resetForm('user')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import RoleSelect from '@/components/User/RoleSelect';

import * as validate from '@/utils/validate';

export default {
  name: 'CreateUser',
  components: {
    RoleSelect
  },
  data() {
    return {
      user: {
        username: '',
        phone: '',
        email: '',
        roles: [],
        validTime: this.$moment().add(3, 'M'),
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
        roles: [
          { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
        ],
        validTime: [
          { type: 'date', required: true, message: '请选择用户有效日期', trigger: 'change' }
        ],
      },
      roleSelect: {
        roleMultiple: true,
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName, "formName")
      this.$refs[formName].resetFields();
    },
    // 获取子组件的角色
    getRoles(roles) {
      this.user.roles = roles;
    }
  }
}
</script>
<style lang="scss" scoped>
.form-container{
  width: 500px;
}
</style>
