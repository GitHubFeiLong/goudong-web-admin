<template>
  <section class="app-main">
    <el-backtop target=".app-main" :right="27" :bottom="40" />
    <div id="app-container-parent" class="app-container-parent">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/element-variables';
@import 'element-ui/packages/theme-chalk/src/common/var.scss';
@import "~@/styles/variables.scss";
.app-main {
  /* 84 = navbar + tags-view = 50 + 34 */
  height: calc(100vh - 84px);
  width: 100%;
  position: absolute;
  background-color: $--app-main-background-color;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  /* 两个滚动条交接处 -- x轴和y轴 */
  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: $--scrollbar-background-color;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: #ededed;
  }
  .app-container-parent{
    border-radius: 6px;
    background-color: $--app-container-background-color;
    margin: 15px;
    overflow: hidden;
  }
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
