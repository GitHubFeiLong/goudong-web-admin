<!--修改用户的弹框-->
<template>
  <el-dialog title="编辑用户" width="600px" :visible.sync="visible" @close="close">
    <el-form ref="editUser" :model="user" :rules="rules" label-width="80px">
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
        <RoleSelect :role-multiple="roleSelect.roleMultiple" :default-roles="user.roleIds" @getSelectRoleIds="getSelectRoleIds" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="user.nickName" clearable></el-input>
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
      <el-form-item label="备注" prop="avatar">
        <el-input v-model="user.remark" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm('editUser')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as validate from '@/utils/validate'
import adminEditUser from '@/api/user'
import { Message } from "element-ui"

export default {
  name: 'EditUserDialog',
  components: {
    RoleSelect: () => import('@/components/User/RoleSelect')
  },
  props: {
    // 弹框
    editUserDialog: { required: true, type: Boolean, default: false },
    editUserInfo: { required: false, type: Object }
  },
  data() {
    return {
      visible: false,
      user: {
        id: '',
        username: '',
        phone: '',
        email: '',
        roleIds: [],
        roleNameCn: '',
        nickName: '',
        avatar: '',
        validTime: undefined,
        remark: '',
      },
      rules: {
        username: [
          { required: true },
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
      if (this.visible) {
        this.user = this.editUserInfo;
        this.user = {
          id: this.editUserInfo.id,
          username: this.editUserInfo.username,
          phone: this.editUserInfo.phone,
          email: this.editUserInfo.email,
          roleIds: this.editUserInfo.roleIds,
          roleNameCn: this.editUserInfo.roleNameCn,
          nickName: this.editUserInfo.nickName,
          avatar: this.editUserInfo.avatar,
          validTime: this.editUserInfo.validTime,
          remark: this.editUserInfo.remark,
        };
        //
      } else {
        this.user = {
          id: '',
          username: '',
          phone: '',
          email: '',
          roleIds: [],
          roleNameCn: '',
          nickName: '',
          avatar: '',
          validTime: undefined,
          remark: '',
        };
      }
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          adminEditUser(this.user).then(response => {
            const data = response.data.data
            console.log(data)
            Message({
              message: '保存成功',
              type: 'success',
            })
          })
        } else {
          return false;
        }
      });
    },
    // 获取子组件的角色
    getSelectRoleIds(roleIds) {
      this.user.roleIds = roleIds;
    },
    close() {
      // 表单清空
      this.$emit("closeEditUserDialog", false)
    }
  },
}
</script>
<style lang="scss" scoped>

</style>
