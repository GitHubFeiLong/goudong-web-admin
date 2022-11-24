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
        <el-input v-model="user.nickname" clearable />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-update-class"
          list-type="picture-card"
          :file-list="avatar.fileList"
          :action="avatar.avatarAction"
          :on-preview="handlePictureCardPreview"
          :multiple="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          :on-progress="handleProgress"
          :on-change="handleChange"
          :on-error="handleError"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="avatar.dialogVisible" :modal="false">
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
          />
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
import { Message } from "element-ui"

export default {
  name: 'EditUserDialog',
  components: {
    RoleSelect: () => import('@/components/User/RoleSelect')
  },
  props: {
    // 弹框
    editUserDialog: {
      required: true,
      type: Boolean,
      default: function() {
        return false
      }
    },
    editUserInfo: { required: false,
      type: Object,
      default: function() {
        return {}
      }
    }
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
          { required: true, message: '请选择用户有效日期', trigger: 'change' }
        ],
      },
      roleSelect: {
        roleMultiple: true,
        roles: []
      },
      avatar: {
        avatarAction: '/api/file/upload-group/upload',
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: [], // 已上传的文件列表
      }
    };
  },
  watch: {
    // 监听 editUserDialog
    editUserDialog() {
      this.visible = this.editUserDialog;
      if (this.visible) {
        // this.user = this.editUserInfo;
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
        }
        // 设置头像默认值
        if (this.user.avatar) {
          this.avatar.fileList = [{ name: '头像', url: this.user.avatar }]
          setTimeout(() => {
            document.getElementsByClassName("avatar-update-class")[0].getElementsByClassName("el-upload el-upload--picture-card")[0].classList.add("hidden")
          }, 1)
        }
      } else {
        this.user = {
          id: '',
          roleNameCn: '',
          nickname: '',
          avatar: '',
          validTime: new Date(),
          remark: '',
        };
        this.avatar.fileList = []
        document.getElementsByClassName("avatar-update-class")[0].getElementsByClassName("el-upload el-upload--picture-card")[0].classList.remove("hidden")
      }
    },
    'avatar.fileList': function(newVal, oldVal) {
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          adminEditUser(this.user).then(data => {
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
    handleChange(file, fileList) {
      console.log("fileList:", fileList)
      console.log("fileList:", fileList.length > 1)
    },
    beforeAvatarUpload(file) {
      const typeSuccess = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!typeSuccess) {
        this.$message.error('上传头像图片只能是 png、jpg、jpeg 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return typeSuccess && isLt2M;
    },
    // 文件上传时
    handleProgress(event, file, fileList) {
      // 上传时，将上传隐藏
      document.getElementsByClassName("avatar-update-class")[0].getElementsByClassName("el-upload el-upload--picture-card")[0].classList.add("hidden")
    },
    // 上传成功回调
    handleAvatarSuccess(data, file, fileList) {
      this.user.avatar = data.data.fileLink
    },
    handlePictureCardPreview(file) {
      this.avatar.dialogImageUrl = file.url;
      this.avatar.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      document.getElementsByClassName("avatar-update-class")[0].getElementsByClassName("el-upload el-upload--picture-card")[0].classList.remove("hidden")
    },
    handleError(err, file, fileList) {
      document.getElementsByClassName("avatar-update-class")[0].getElementsByClassName("el-upload el-upload--picture-card")[0].classList.remove("hidden")
      // 获取失败的信息
      const errMessage = JSON.parse(err["message"]);
      if (errMessage.clientMessage) {
        this.$message.error(errMessage.clientMessage)
      } else {
        this.$message.error("上传失败，请稍后再试")
      }
    }
  },
}
</script>
<style>
/*动态显示和隐藏头像上传*/
.hidden{
  display: none;
}
</style>
