<template>
  <div id="app-container" class="app-container">
    <iframe
      class="iframe"
      :src="src"
      height="100%"
      width="100%"
      frameborder="0"
    />
  </div>
</template>
<script>
export default {
  name: 'UserPage',
  data() {
    return {
      src: "https://element.eleme.cn/#/zh-CN/component/icon"
    }
  }
}
</script>
<style lang="scss">
 #app-container-parent{

    height: calc(100% - 30px)!important;
   #app-container {
      height: 100%;
   }
}

</style>
