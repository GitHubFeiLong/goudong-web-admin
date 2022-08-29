<!--修改用户的弹框-->
<template>
  <el-dialog title="编辑用户" width="600px" :visible.sync="visible" @close="close">
    <el-form ref="user" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username" :disabled="true" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" :disabled="true" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="user.email" :disabled="true" />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <RoleSelect :role-multiple="roleSelect.roleMultiple" :default-roles="user.roleIds" @getRoles="getRoles" />
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('user')">重 置</el-button>
      <el-button type="primary" @click="submitForm('user')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as validate from '@/utils/validate'
import { getUserById } from '@/api/user'
import { Message } from "element-ui"

export default {
  name: 'EditUserDialog',
  components: {
    RoleSelect: () => import('@/components/User/RoleSelect')
  },
  props: {
    // 弹框
    editUserDialog: { required: true, type: Boolean, default: false },
    userId: { required: false, type: String }
  },
  data() {
    return {
      visible: false,
      user: {
        username: '',
        phone: '',
        email: '',
        roleIds: [],
        nickName: '',
        avatar: '',
        validTime: undefined,
      },
      rules: {
        username: [
          { required: true, validator: validate.username, trigger: 'blur' },
        ],
        phone: [
          { required: true }
        ],
        email: [
          { required: true }
        ],
        roleIds: [
          { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'blur' }
        ],
        validTime: [
          { type: 'date', required: true, message: '请选择用户有效日期', trigger: 'blur' }
        ],
      },
      roleSelect: {
        roleMultiple: true,
        roles: []
      }
    };
  },
  watch: {
    // 监听 editUserDialog
    editUserDialog() {
      this.visible = this.editUserDialog;
    },
    // 监听父组件传递的用户id
    userId() {
      if (this.visible && this.userId) {
        getUserById(this.userId).then(response => {
          this.user = response.data.data;
          // 角色id 集合
          const roles = [];
          response.data.data.roles.map(m => {
            roles.push({ value: m.id, label: m.roleNameCn });
          })
          this.roleSelect.roles = roles;
        })
      }
    }
  },
  mounted() {

  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          simpleCreateUser(this.user).then(response => {
            // 保存成功
            Message({
              message: '修改成功',
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
      this.$emit("update:editUserDialog", false)
    }
  },
}
</script>
<style lang="scss" scoped>

</style>
