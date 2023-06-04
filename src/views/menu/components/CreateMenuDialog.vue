<!--新增菜单的弹框-->
<template>
  <el-dialog title="新增菜单" width="800px" :visible.sync="visible" @close="close">
    <el-form ref="addMenuForm" :model="menu" :rules="rules" label-width="80px" :inline="true">
      <el-form-item label="上级菜单" prop="parentId">
        <!--  选择器选项以树形控件展示  -->
        <el-select ref="selectParentMenu" v-model="form.id" placeholder="请选择上级菜单">
          <el-option :key="form.id" :value="form.id" :label="form.label" hidden />
          <el-tree
            :data="data"
            :props="defaultProps"
            node-key="id"
            accordion
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单类型" prop="remark">
        <el-radio-group v-model="menu.remark">
          <el-radio :label="0">接口</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>

      <el-form-item label="路由地址" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>
      <el-form-item label="请求方式" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>

      <el-form-item label="排序号" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>
      <el-form-item label="是否展示" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>

      <el-form-item label="菜单元数据" prop="remark">
        <el-input v-model="menu.remark" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" />
  </el-dialog>
</template>

<script>

export default {
  name: 'CreateMenuDialog',
  props: {
    // 弹框
    createMenuDialog: {
      required: true,
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      /* props: {
        label: 'name',
        children: 'children'
      },*/
      form: {
        id: '',
        value: ''
      },
      visible: false,
      menu: {
        parentId: undefined,
        remark: '',
      },
      rules: {
        parentId: [
          { required: true, min: 1, max: 64, message: '角色名称限制1~64字符', trigger: 'blur' },
        ],
        remark: [
          { required: false, max: 255, message: '备注限制最多255字符', triangle: 'blur' }
        ]
      }
    };
  },
  watch: {
    createMenuDialog() {
      this.visible = this.createMenuDialog;
    },
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
      this.form = {
        id: data.label,
        value: data.label
      }
      // 使 input 失去焦点，并隐藏下拉框
      this.$refs.selectParentMenu.blur()
    },
    submitForm(formName) {
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     // addRole(this.role).then(response => {
      //     //   this.$message.success("保存成功")
      //     //   this.visible = false
      //     //   // 调用父组件的方法
      //     //   this.$parent.loadPageRole();
      //     // })
      //   } else {
      //     return false;
      //   }
      // });
    },
    close() {
      this.$emit("update:createMenuDialog", false)
    }
  },
}
</script>
<style lang="scss" scoped>

</style>
