<!--菜单页面-->
<template>
  <div class="app-container">
    <el-container class="app-container-main">
      <el-header height="76px">
        <el-button icon="el-icon-plus" type="primary" @click="addMenu">新增</el-button>
        <el-button @click="expandedTree(true)">展开全部</el-button>
        <el-button @click="expandedTree(false)">折叠全部</el-button>
      </el-header>
      <el-container class="app-inner-container">
        <el-aside width="230px">
          <div class="menu-filter-div">
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
          >
            <template v-slot="{ node, data }">
              <span>
                <i :class="data.icon" />
                <span class="el-tree-node-span">{{ data.name }}</span>
              </span>
            </template>
          </el-tree>
        </el-aside>
        <el-main>
          <div class="menu-detail-header">角色管理</div>
        </el-main>
      </el-container>
    </el-container>

    <!--  新增菜单弹窗  -->
    <CreateMenuDialog :create-menu-dialog.sync="createMenuDialog" :refresh-menu="load" />
  </div>
</template>

<script>
import { listMenuApi } from "@/api/menu";
import { excludeApi } from "@/utils/tree";

export default {
  name: 'MenuPage',
  components: {
    CreateMenuDialog: () => import('@/views/menu/components/CreateMenuDialog'),
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
      createMenuDialog: false, // 创建菜单弹窗
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

        // 将菜单中的接口过滤
        const arr2 = excludeApi(this.menus)
        this.$store.dispatch('menu/setAllMenus', arr2);
      })
    },
    expandedTree(flag) { // 展开或收缩菜单tree
      const nodes = this.$refs.menuTree.store.nodesMap;
      console.log(nodes)
      for (const i in nodes) {
        nodes[i].expanded = flag;
      }
    },
    filterNode(value, data, node) {
      if (!value) return true;
      const _array = []; // 这里使用数组存储 只是为了存储值。
      this.getReturnNode(node, _array, value);
      let result = false;
      _array.forEach(item => {
        result = result || item;
      });
      return result;
    },
    getReturnNode(node, _array, value) {
      const isPass =
        node.data &&
        node.data.name &&
        node.data.name.indexOf(value) !== -1;
      isPass ? _array.push(isPass) : "";
      if (!isPass && node.level !== 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value);
      }
    },
    addMenu() { // 新增菜单
      this.createMenuDialog = true
    },
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.app-container-main{
  .el-header{
    padding: 20px 20px;
    border-bottom: 1px solid $borderColor;
  }

  .app-inner-container {
    min-height: calc(100vh - 126px);
    padding: 0 20px;
    aside{
      background-color: #fff;
      position: relative;
      border-right: 1px solid $borderColor;
      padding: 0 20px 0 0;
      .menu-filter-div{
        padding: 20px 0 20px 0;
      }
      .el-tree {
        .el-tree-node-span {
          display: inline-block;
          margin-left: 5px;
        }
      }
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
}

</style>
