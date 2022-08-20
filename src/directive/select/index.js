import Vue from 'vue'

// const install = function(Vue) {
//   Vue.directive('loadmore', select)
// }
//
// if (window.Vue) {
//   window['select'] = select
//   Vue.use(install); // eslint-disable-line
// }
//
// select.install = install
// export default select


// 注册下拉框滚动底部指令

Vue.directive('loadmore', {
  bind(el, binding) {
    console.log(1111)
    // 获取element-ui定义好的scroll盒子 下拉选框滚动底部事件
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    SELECTWRAP_DOM.addEventListener('scroll', function () {

      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (CONDITION) {
        binding.value()
      }
    })
  }
})

// 注册 表格滚动底部指令

Vue.directive('moretable', {
  bind(el, binding) {
    console.log(2222)
    // 获取element-ui定义好的scroll盒子 表格滚动底部事件
    const TABLE_DOM = el.querySelector('.table-style .el-table__body-wrapper')
    TABLE_DOM.addEventListener('scroll', function () {

      const CONDITIONVALUE = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (CONDITIONVALUE) {
        binding.value()
      }
    })
  }
})
