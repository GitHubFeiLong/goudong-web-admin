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
          <el-input v-model="user.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="region">
          <el-select
            v-model="role.roleNameCn"
            :loading="role.loading"
            :remote-method="loadMoreRole"
            allow-create
            class="filter-item"
            clearable
            filterable
            placeholder="请输入用户名"
            remote
            style="width: 200px;"
            @keyup.enter.native="handleFilter"
          >
            <el-option
              v-for="item in role.roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="昵 称" prop="name">
          <el-input v-model="user.name" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="name">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="有效日期" prop="name">
          <el-input v-model="user.name"></el-input>
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
import {pageUserByField} from "@/api/user";
import { password } from "@/utils/validate";
export default {
  name: 'CreateUser',
  data() {
    return {
      user: {
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: password, trigger: 'blur' },
          // { min: 8, max: 20, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
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
