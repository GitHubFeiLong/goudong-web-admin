<!--菜单页面-->
<template>
  <div class="app-container">
    <el-container class="app-inner-container">
      <el-aside width="230px">
        <div class="filter-container">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
          />
        </div>
        <el-tree
          ref="menuTree"
          class="my-tree"
          :props="props"
          :data="menus"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          default-expand-all
          node-key="id"
          @node-contextmenu="rightClick"
        />
        <!--  v-show="menuVisible"       -->
        <div class="option">
          <ul id="menu" class="menu">
            <li class="menu__item">平级添加</li>
            <li class="menu__item">下级添加</li>
            <li class="menu__item">删除</li>
          </ul>
        </div>
      </el-aside>
      <el-main>main</el-main>
    </el-container>
  </div>
</template>

<script>
import { listMenuApi } from "@/api/menu";

export default {
  name: 'MenuPage',
  components: {
  },
  data() {
    return {
      filterText: undefined,
      menus: [],
      props: {
        label: 'name',
        children: 'children'
      },
      menuVisible: false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      listMenuApi().then(data => {
        this.menus = data;
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    rightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
      this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
      var menu = document.querySelector('#menu')
      // menu.style.left = MouseEvent.clientX - 10 + 'px'
      document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
      menu.style.top = MouseEvent.clientY - 115 + 'px'
      console.log('右键被点击的event:', MouseEvent)
      console.log('右键被点击的object:', object)
      console.log('右键被点击的value:', Node)
      console.log('右键被点击的element:', element)
      console.log('鼠标点击了树形结构图')
    },
    foo() { // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
    },

  }
}
</script>
<style lang="scss">
.app-inner-container {
  min-height: calc(100vh - 126px);
  aside{
    background-color: #fff;
    padding: 8px 15px;
    position: relative;
  }
  .option{
    width: 100px;
    height: 100px;
    left: 85px;
    position: absolute;
    top: 62px;
    .menu__item {
      display: block;
      line-height: 20px;
      text-align: center;
      margin-top: 10px;
      border-radius: 5px;
    }
    .menu {
      height: 100%;
      width: 100%;
      position: relative;
      border-radius: 5px;
      border: 1px solid #999999;
      background-color: #f4f4f4;
      padding: 0px 2px;
    }
    li:hover {
      background-color: #1790ff;
      color: white;
      cursor: pointer;
    }
  }
}
</style>
