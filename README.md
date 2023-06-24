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