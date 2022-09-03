import Vue from 'vue'

// 注册下拉框滚动底部指令
Vue.directive('load-more', {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子 下拉选框滚动底部事件
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    SELECTWRAP_DOM.addEventListener('scroll', function() {
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
    // 获取element-ui定义好的scroll盒子 表格滚动底部事件
    const TABLE_DOM = el.querySelector('.table-style .el-table__body-wrapper')
    TABLE_DOM.addEventListener('scroll', function() {
      const CONDITIONVALUE = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (CONDITIONVALUE) {
        binding.value()
      }
    })
  }
})
