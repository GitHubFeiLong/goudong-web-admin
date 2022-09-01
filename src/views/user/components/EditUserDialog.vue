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
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="user.nickname" clearable></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          :action="avatar.avatarAction"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :multiple=false
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="avatar.dialogVisible" :modal=false>
          <img width="100%" :src="avatar.dialogImageUrl" alt="">
        </el-dialog>

      </el-form-item>
      <el-form-item label="有效日期" prop="validTime">
        <div class="block">
          <el-date-picker
            v-model="user.validTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
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
import { adminEditUser } from '@/api/user'
import { simpleUpload } from '@/api/file'
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
        nickname: '',
        avatar: '',
        validTime: new Date(),
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
          {required: true, message: '请选择用户有效日期', trigger: 'change' }
        ],
      },
      roleSelect: {
        roleMultiple: true,
        roles: []
      },
      avatar: {
        avatarAction: 'http://localhost:10004/api/file/upload-group/upload',
        imageUrl: '',
        dialogImageUrl: '',
        dialogVisible: false,
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
          nickname: this.editUserInfo.nickname,
          avatar: this.editUserInfo.avatar,
          validTime: this.editUserInfo.validTime,
          remark: this.editUserInfo.remark,
        };
        //
      } else {
        this.user = {
          id: '',
          roleNameCn: '',
          nickname: '',
          avatar: '',
          validTime: new Date(),
          remark: '',
        };
      }
    },
  },
  methods: {
    submitForm(formName) {
      console.log("点击编辑按钮")
      this.$refs[formName].validate((valid) => {
        if (valid) {
          adminEditUser(this.user).then(response => {
            const data = response.data.data
            console.log(data)
            Message({
              message: '保存成功',
              type: 'success',
            })
            // 关闭弹框
            this.close();
            // 刷新列表
            this.$parent.loadPageUser();
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
      this.$refs.editUser.resetFields();
      this.$emit("closeEditUserDialog", false)
    },
    beforeAvatarUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      return true;
      // return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      this.avatar.imageUrl = URL.createObjectURL(file.raw);
    },
    handlePictureCardPreview(file) {
      this.avatar.dialogImageUrl = file.url;
      this.avatar.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    }
  },
}
</script>
<style lang="scss" scoped>
//.avatar-uploader .el-upload {
//  border: 1px dashed #d9d9d9;
//  border-radius: 6px;
//  cursor: pointer;
//  position: relative;
//  overflow: hidden;
//}
//.avatar-uploader .el-upload:hover {
//  border-color: #409EFF;
//}
//.avatar-uploader-icon {
//  font-size: 28px;
//  color: #8c939d;
//  width: 178px;
//  height: 178px;
//  line-height: 178px;
//  text-align: center;
//}
//.avatar {
//  width: 178px;
//  height: 178px;
//  display: block;
//}
</style>
