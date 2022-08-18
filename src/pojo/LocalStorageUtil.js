/**
 * localStorage 封装
 */
export default class LocalStorageUtil {
  static s = window.localStorage;

  static token = 'token';

  /**
   * 保存值
   * @param key
   * @param value
   */
  static set(key, value) {
    if (typeof value === 'object') {
      LocalStorageUtil.s.setItem(key, JSON.stringify(value))
    } else {
      LocalStorageUtil.s.setItem(key, value)
    }
    if (value === undefined || value === null) {
      LocalStorageUtil.s.removeItem(key)
    }
  }

  /**
   * 获取值
   * @param key
   */
  static get(key) {
    const item = LocalStorageUtil.s.getItem(key)
    try {
      return JSON.parse(item)
    } catch (e) {
      return item
    }
  }

  /**
   * 判断是否存在key
   * @param key
   */
  static has(key) {
    return !!LocalStorageUtil.s.getItem(key)
  }

  /**
   * 删除值
   * @param key
   */
  static remove(key) {
    LocalStorageUtil.s.removeItem(key)
  }
}
