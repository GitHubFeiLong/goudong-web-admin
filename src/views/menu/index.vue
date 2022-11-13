<!--菜单页面-->
<template>
  <div class="app-container">
    <el-container class="app-inner-container">
      <el-aside width="200px" class="aaa">
        <el-tree
          ref="menuTree"
          class="my-tree"
          :props="props"
          :data="menus"
          :check-strictly="checkStrictly"
          :default-checked-keys="defaultCheckedKeys"
          default-expand-all
          node-key="id"
        />
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
      menus: [],
      props: {
        label: 'name',
        children: 'children'
      },
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
  }
}
</script>
<style lang="scss">
.app-inner-container {
  min-height: calc(100vh - 126px);
  background-color: #eef1f6;
  aside{
    background-color: #fff;
  }
}
</style>
