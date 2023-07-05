<!--菜单页面-->
<template>
  <div class="app-container">
    <el-container class="app-container-main">
      <el-header height="76px">
        <el-button icon="el-icon-edit" type="primary" @click="initMenu">初始菜单</el-button>
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
            :highlight-current="highlightCurrent"
            default-expand-all
            node-key="id"
            @node-click="menuNodeClick"
          >
            <template v-slot="{ node, data }">
              <span>
                <i v-if="data.type === 1" class="el-icon-folder" />
                <svg-icon v-else icon-class="iconfont-anniuquanxiang" />
                <span class="el-tree-node-span">{{ data.name }}</span>
              </span>
            </template>
          </el-tree>
        </el-aside>
        <el-main class="detail">
          <DetailMenu v-show="selectMenu.menuFullName !== ''" :select-menu="selectMenu" />
        </el-main>
      </el-container>
    </el-container>

    <!--  新增菜单弹窗  -->
    <CreateMenuDialog :create-menu-dialog.sync="createMenuDialog" :refresh-menu="load" />
  </div>
</template>

<script>
import { initMenuApi, listMenuApi } from "@/api/menu";
import { excludeApi } from "@/utils/tree";
import { goudongWebAdminResource } from "@/router/modules/goudong-web-admin-router";

export default {
  name: 'MenuPage',
  components: {
    CreateMenuDialog: () => import('@/views/menu/components/CreateMenuDialog'),
    DetailMenu: () => import('@/views/menu/components/DetailMenu'),
  },
  data() {
    return {
      filterText: undefined,
      menus: [],
      props: {
        label: 'name',
        children: 'children'
      },
      highlightCurrent: true, // 高亮显示  不让背景消失
      selectMenu: { // 当前选中的菜单
        menuFullName: ''
      },
      // menuVisible: false,
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
    menuNodeClick(data, node) { // 菜单节点被点击
      // console.log(data)
      // console.log(node)
      this.selectMenu = { ...data }
      this.selectMenu.menuFullName = this.getMenuAllName(node)
    },
    getMenuAllName(node) {
      if (node) {
        if (node.level !== 1) {
          return this.getMenuAllName(node.parent) + " / " + node.data.name
        } else {
          return node.data.name;
        }
      }
      return ""
    },
    // 推送菜单
    initMenu() {
      const menus = [];
      console.log(goudongWebAdminResource)
      goudongWebAdminResource.filter(f => !f.hidden).forEach((item, index, arr) => {
        const obj = this.generate(item);
        menus.push(obj)
      })
      console.log(menus);

      initMenuApi(menus).then(data => {
        this.$message.success("推送成功")
      })
    },
    generate(item) {
      const obj = {
        name: item.name,
        type: item.type,
        openModel: item.openModel,
        path: item.path,
        permissionId: item.permissionId,
        method: item.method,
        metadata: item.meta,
      }
      if (item.meta) {
        if (item.meta.icon) {
          obj.icon = item.meta.icon
        }
        if (!item.meta.title) {
          obj.metadata.title = obj.name
        }

        obj.metadata = JSON.stringify(obj.metadata)
      }
      // 菜单（组件）未单独配置组件路由
      if (item.type === 1 && !item.componentPath) {
        obj.componentPath = item.path
      }

      if (item.children) {
        // 子元素
        obj.children = [];
        item.children.forEach((i, index, arr) => {
          obj.children.push(this.generate(i));
        })
      }
      return obj;
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
  }
}

</style>
