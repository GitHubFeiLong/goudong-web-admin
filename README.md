# Goudong Web Admin
狗东后台管理系统

## icon的使用

### 制作icon
1. 访问 [iconfont](https://www.iconfont.cn/)
2. 添加喜欢的icon到自己的项目
3. 在项目中，找到要使用的icon，然后点击编辑
4. 在编辑弹框中，使用放大缩小按钮，icon填充怎么网格，这样在使用时才不会显得很小，最后点击仅保存
5. 将鼠标移入图标，点击下载，在弹框中复制SVG代码
6. 打开 [svgo](https://www.zhangxinxu.com/sp/svgo/),将复制的SVG代码粘贴
7. 复制压缩后的SVG代码到项目 src/icons/svg中，并删除fill属性
上面步骤完成后，icon就能直接使用了，使用方式：
```html
<!--user 是icon的文件名-->
 <svg-icon icon-class="user" />
```

## 按钮权限
前端项目中有三类需要注意的按钮权限：
1. 主要按钮：新增、删除、编辑、上传下载等
2. 切换状态按钮：激活，锁定等
3. 表格操作栏中的按钮：删除、编辑、审核等

### 方法
1. 使用全局指令
2. 使用全局方法

#### 全局指令
使用全局指令`v-permission`,
```html
<!--从html中移除该元素-->
<el-button v-permission="'sys:menu:delete'"></el-button>
```
默认将其元素从父节点移除，它还有两个属性：
```html
<!--将按钮的点击事件取消-->
<el-button v-permission.disable="'sys:menu:delete'"></el-button>
<!--将按钮z-index设置很低-->
<el-button v-permission.hide="'sys:menu:delete'"></el-button>
```
### 全局方法
使用全局方法`permissionDisabled('permissionId')`,使用该方式，可以返回true，false，使其elementUI的某些禁用属性生效。

```vue
 <el-table-column label="锁定">
  <template v-slot="scope">
  <!--permissionDisabled方法返回true 或 false-->
    <el-switch v-model="scope.row.locked" :disabled="permissionDisabled('sys:user:lock')"/>
  </template>
</el-table-column>
```