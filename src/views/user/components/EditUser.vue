<template>
  <div class="app-container">
    <div class="form-container">
      <el-form :model="user" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="user.confirmPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <RoleSelect />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="user.nickName" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="user.avatar"></el-input>
        </el-form-item>
        <el-form-item label="有效日期" prop="validTime">
          <div class="block">
            <el-date-picker
              v-model="user.validTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
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
import { password } from "@/utils/validate";
export default {
  name: 'CreateUser',
  components: {
    RoleSelect
  },
  data() {
    return {
      user: {
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: '',
        roles: [],
        nickName: '',
        avatar: '',
        validTime: this.$moment().add(3, 'M'),
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: password, trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, validator: password, trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入用户的手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户的邮箱', trigger: 'blur' }
        ],
        roles: [
          { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
        ],
        validTime: [
          { type: 'date', required: true, message: '请选择用户有效日期', trigger: 'change' }
        ],
      },
      role: {
        roleNameCn: '',
        loading: false,
        roles: []
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
      this.$refs[formName].resetFields();
    },
    loadMoreRole(roleNameCn) {
      // if (usernamePattern !== '') {
      //   this.usernameFilter.loading = true
      //   const page = {page: this.usernameFilter.page, size: this.usernameFilter.size, username: usernamePattern}
      //   pageUserByField(page).then(response => {
      //     this.loading = false
      //     const content = response.data.data.content
      //     if (content && content.length > 0) {
      //       // 将value使用逗号拼接起来，用于去重。
      //       const existsUsernames = this.usernameFilter.usernames.map((item) => {
      //         return item.value
      //       }).join()
      //       content.forEach((user, index, arr) => {
      //         if (existsUsernames.indexOf(user.username) === -1) {
      //           this.usernameFilter.usernames.push({value: user.username, label: user.username})
      //         }
      //       })
      //     }
      //   }).catch(err => {
      //     console.warn('err', err)
      //   })
      // } else {
      //   this.usernameFilter.usernames = []
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.form-container{
  width: 500px;
}
</style>
