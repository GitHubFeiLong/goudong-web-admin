import Vue from 'vue'

import Cookies from 'js-cookie'
// eslint-disable-next-line
import loadMore from "@/directive/select";
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/packages/theme-chalk/src/common/var.scss'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
import '@/styles/dialog.scss' // global css
import '@/styles/table.scss' // global css
import '@/styles/variables.scss' // global css
import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters
import globalVariable from '@/constant/global-variable'

import moment from 'moment'
import { none } from "html-webpack-plugin/lib/chunksorter";
import checkPermission from "@/utils/permission";
moment.locale('zh-cn')

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  // set element-ui default size
  size: Cookies.get('size') || 'medium'
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 全局指令
Vue.directive('permission', {
  // 或事件监听器应用前调用
  inserted(el, binding, vnode) {
    console.log(el, binding, vnode)
    const value = binding.value;
    if (!checkPermission(value)) {
      // 没有权限 移除Dom元素
      if (binding.modifiers['disable']) {
        console.log(el.classList)
        el.classList.add("el-link-disable")
      } else if (binding.modifiers['remove']) {
        el.parentNode && el.parentNode.removeChild(el)
      } else if (binding.modifiers['hide']) {
        el.style.zIndex = -9999
      } else {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  },
})
// 挂载变量到vue上
Vue.prototype.$globalVariable = globalVariable
// 挂在mount
Vue.prototype.$moment = moment
new Vue({
  el: '#app',
  router,
  store,

  render: h => h(App)
})
