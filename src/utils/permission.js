import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value) {
    // 判断按钮权限有没有
    const permissionButton = store.getters.permissionButtons.find((item, index, arr) => item.permissionId === value);
    return permissionButton !== null && permissionButton !== undefined
  }
  return false
}

