<!--菜单明细-->
<template>
  <div>
    <div class="detail-menu-header">{{ selectMenu.menuFullName }}</div>

    <div class="detail-menu-body">
      <el-form ref="addMenuForm1" :model="menu" :rules="rules" label-width="100px" :inline="true" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级菜单:" prop="parentId">
              <!--  选择器选项以树形控件展示  -->
              <el-select ref="selectParentMenu" v-model="parentMenu.id" placeholder="请选择上级菜单">
                <el-option :key="parentMenu.id" :value="parentMenu.id" :label="parentMenu.name" hidden />
                <el-tree
                  :data="menuData"
                  :props="menuProps"
                  node-key="id"
                  accordion
                  highlight-current
                  @node-click="handleMenuNodeClick"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型:" prop="type">
              <el-radio-group v-model="menu.type">
                <el-radio :label="0">接口</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称:" prop="name">
              <el-input v-model="menu.name" clearable placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打开方式:" prop="openModel">
              <el-radio-group v-model="menu.openModel">
                <el-radio :label="0">内链</el-radio>
                <el-radio :label="1">外链</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!--分隔符-->
        <el-row>
          <el-col :span="24">
            <div class="cutting-line el-divider el-divider--horizontal" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单图标:" prop="remark" :class="iconInputClass">
              <el-select v-model="menu.icon" popper-class="icon-el-select" :popper-append-to-body="false" placeholder="请选择菜单图标" :disabled="menu.type === 2" clearable>
                <template #prefix>
                  <span style="padding-left: 5px; color: #606266 ">
                    <i :class="menu.icon" />
                  </span>
                </template>
                <el-option
                  v-for="item in icons"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                  <el-tooltip placement="top">
                    <div slot="content">{{ item }}</div>
                    <i :class="item" />
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识:" prop="permissionId">
              <el-input v-model="menu.permissionId" placeholder="请输入权限标识" clearable :disabled="menu.type === 0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="routePath.label" prop="path">
              <el-input v-model="menu.path" :placeholder="routePath.placeholder" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式:" prop="method">
              <el-select
                v-model="menu.method"
                multiple
                collapse-tags
                placeholder="请选择请求方式"
                :disabled="menu.type === 1"
              >
                <el-option
                  v-for="item in methods"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序号:" prop="sortNum">
              <el-input-number v-model="menu.sortNum" :disabled="menu.type === 2" controls-position="right" :min="1" :max="99999" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否展示:" prop="hide">
              <el-switch
                v-model="menu.hide"
                :active-value="false"
                :inactive-value="true"
                :disabled="menu.type === 0"
              />
              <el-tooltip placement="top">
                <div slot="content">选择不展示只注册路由不显示在侧边栏，比如添加页面应该选择不展示</div>
                <i class="el-icon-warning-outline question" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="addMenuForm2" :model="menu" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="菜单元数据:" prop="metadata">
          <el-input v-model="menu.metadata" type="textarea" :rows="5" placeholder="请输入JSON格式的路由元数据" :disabled="menu.type === 0" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { EL_ICONS } from "@/constant/commons";
import { isJSON } from "@/utils/validate";
export default {
  name: 'DetailMenu',
  props: {
    // 弹框
    selectMenu: {
      required: true,
      type: Object,
      default: function() {
        return false;
      }
    },
  },
  data() {
    const validateMetadata = (rule, value, callback) => {
      isJSON(value).then(boo => {
        console.log(boo)
        if (!boo) {
          callback(new Error(""));
        } else {
          callback();
        }
      })
    };
    return {
      menuData: undefined,
      menuProps: {
        label: 'name',
        children: 'children'
      },
      parentMenu: {
        id: '',
        name: ''
      },
      icons: EL_ICONS,
      iconInputClass: 'default-icon-input-class',
      routePath: {
        label: '路由地址:',
        placeholder: '请输入路由地址'
      },
      methods: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'HEAD', label: 'HEAD' },
        { value: 'PATCH', label: 'PATCH' },
        { value: 'OPTIONS', label: 'OPTIONS' },
        { value: 'TRACE', label: 'TRACE' },
      ],
      visible: false,
      menu: {
        parentId: undefined,
        type: 0,
        name: undefined,
        openModel: 0,
        icon: '',
        permissionId: undefined,
        path: undefined,
        method: undefined,
        sortNum: 0,
        hide: true,
        metadata: undefined,
        remark: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        remark: [
          { required: false, max: 255, message: '备注限制最多255字符', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, type: 'number', min: 1, max: 99999, message: '请输入排序号', trigger: 'blur' }
        ],
        metadata: [
          { required: false, message: '请输入正确的JSON格式', trigger: 'blur', validator: validateMetadata }
        ]
      }
    };
  },
  watch: {
    selectMenu() {
      this.menu = { ...this.selectMenu }
      this.menuData = this.$store.getters.allMenus;
      this.parentMenu.id = this.menu.parentId
      this.parentMenu.name = '系统管理'
    },
    'menu.type'() {
      switch (this.menu.type) {
        case 0:
          this.menu.hide = true
          this.routePath = {
            label: '接口地址:',
            placeholder: '请输入接口地址'
          }
          break;
        case 1:
          this.menu.method = undefined
          this.menu.metadata = undefined
          this.menu.hide = false
          this.routePath = {
            label: '路由地址:',
            placeholder: '请输入路由地址'
          }
          break;
        default:
          this.menu.icon = ''
          break;
      }
    },
    'menu.icon'() {
      if (this.menu.icon !== '') {
        this.iconInputClass = 'icon-input-class';
      } else {
        this.iconInputClass = 'default-icon-input-class';
      }
    }
  },
  methods: {
    handleMenuNodeClick(data) {
      // 使 input 失去焦点，并隐藏下拉框
      this.$refs.selectParentMenu.blur()

      this.parentMenu = {
        id: data.id,
        name: data.name
      }
      this.menu.parentId = data.id
    },
    // 重置表单
    resetForm() {
      this.parentMenu = {
        id: '',
        name: ''
      }
      this.menu = {
        parentId: undefined,
        type: 0,
        name: undefined,
        openModel: 0,
        icon: '',
        permissionId: undefined,
        path: undefined,
        method: undefined,
        sortNum: 0,
        hide: false,
        metadata: undefined,
        remark: '',
      }
      this.close();
    },
    submitForm() {
      console.log(this.menu)
      let data = { ...this.menu };
      data.method = JSON.stringify(this.menu.method);
      // addMenuApi(data).then(data => {
      //   this.$message.success("添加成功");
      //   this.refreshMenu();
      //   this.close();
      // })
    },
    close() {
    }
  },
}
</script>
<style lang="scss" scoped>
.detail-menu-header{
  width: 100%;
  height: 36px;
  margin-bottom: 20px;
  line-height: 36px;
  font-size: 18px;
}
.detail-menu-body {
  .cutting-line{
    margin: 8px 0 30px 0;
  }

  .question{
    display: inline-block;
    position: absolute;
    margin: 13px 6px;
  }
  .el-form-item {
    .el-input-number--medium {
      width: 230px;
    }
    .el-input {
      width: 230px;
    }
    .el-select{
      width: 230px;
    }
  }
  ::v-deep .default-icon-input-class{
    .el-input--prefix .el-input__inner {
      padding-left: 15px !important;
    }
  }
  ::v-deep .icon-input-class {
    .el-input--prefix .el-input__inner {
      padding-left: 30px !important;
    }
  }
  ::v-deep .icon-el-select .el-scrollbar__view {
    display: flex;
    justify-content: space-around;
    width: 230px;
    flex-flow: wrap;
    padding: 6px;
    li {
      width: 45px;
      height: 45px;
      border: 1px solid #ededed;
      border-radius: 4px;
      padding: 12px;
      margin-top: 10px;
    }
    .selected{
      border: 1px solid #409EFF;
    }
    i{
      font-size: 19px;
      position: absolute;
    }
  }
}
</style>
