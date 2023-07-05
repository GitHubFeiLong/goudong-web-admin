import LocalStorageUtil from "@/utils/LocalStorageUtil";
import { PERMISSION_BUTTONS_LOCAL_STORAGE } from "@/constant/LocalStorageConst";

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value) {
    // 判断按钮权限有没有
    const permissionButton = LocalStorageUtil.get(PERMISSION_BUTTONS_LOCAL_STORAGE).find((item, index, arr) => item === value);
    return permissionButton !== null && permissionButton !== undefined
  }
  return false
}

