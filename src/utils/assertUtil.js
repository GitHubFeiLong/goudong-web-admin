// 断言工具类，封装promise
/**
 * 断言{@code obj}为null
 * @param obj
 * @returns {Promise<unknown>}
 */
export function isNull(obj, callback) {
  return new Promise((resolve, reject) => {
    if (obj === null) {
      return resolve();
    }
    // 提示
    if (typeof callback === 'function') {
      callback();
    }
    return reject();
  });
}

/**
 * 断言{@code obj}不为null
 * @param obj
 * @returns {Promise<unknown>}
 */
export function isNotNull(obj, callback) {
  return new Promise((resolve, reject) => {
    if (obj === null) {
      // 提示
      if (typeof callback === 'function') {
        callback();
      }
      return reject();
    }
    return resolve();
  });
}

/**
 * 断言{@code obj}为undefined
 * @param obj
 * @returns {Promise<unknown>}
 */
export function isUndefined(obj, callback) {
  return new Promise((resolve, reject) => {
    if (obj === undefined) {
      return resolve();
    }
    // 提示
    if (typeof callback === 'function') {
      callback();
    }
    return reject();
  });
}

/**
 * 断言{@code obj}不为undefined
 * @param obj
 * @returns {Promise<unknown>}
 */
export function isNotUndefined(obj, callback) {
  return new Promise((resolve, reject) => {
    if (obj === undefined) {
      // 提示
      if (typeof callback === 'function') {
        callback();
      }
      return reject();
    }
    return resolve();
  });
}

/**
 * 断言{@code boo}为true
 * @param boo
 * @returns {Promise<unknown>}
 */
export function isTrue(boo, callback) {
  return new Promise((resolve, reject) => {
    if (boo === true) {
      return resolve();
    }
    // 提示
    if (typeof callback === 'function') {
      callback();
    }
    return reject();
  });
}

/**
 * 断言{@code boo}为false
 * @param boo
 * @returns {Promise<unknown>}
 */
export function isFalse(boo, callback) {
  return new Promise((resolve, reject) => {
    if (boo === true) {
      // 提示
      if (typeof callback === 'function') {
        callback();
      }
      return reject();
    }
    return resolve();
  });
}

/**
 * 断言{@code str}为空白串
 * <pre>
 *   ""         ->  true
 *   "  "       ->  true
 *   null       ->  true
 *   undefined  ->  true
 * </pre>
 * @param boo
 * @returns {Promise<unknown>}
 */
export function isBlank(str, callback) {
  return new Promise((resolve, reject) => {
    if (str === null || str === undefined || (typeof str === "string" && str.trim() === "")) {
      return resolve();
    }
    // 提示
    if (typeof callback === 'function') {
      callback();
    }
    return reject();
  });
}

/**
 * 断言{@code str}为空白串
 * <pre>
 *   ""         ->  false
 *   "  "       ->  false
 *   null       ->  false
 *   undefined  ->  false
 * </pre>
 * @param boo
 * @returns {Promise<unknown>}
 */
export function isNotBlank(str, callback) {
  return new Promise((resolve, reject) => {
    if (str === null || str === undefined || typeof str !== "string" || str.trim() === "") {
      // 提示
      if (typeof callback === 'function') {
        callback();
      }
      return reject();
    }
    return resolve();
  });
}

/**
 * 断言{@code arr}为空数组
 * <pre>
 *   []         ->  true
 *   null       ->  true
 *   undefined  ->  true
 * </pre>
 * @param boo
 * @returns {Promise<unknown>}
 */
export function isEmpty(arr, callback) {
  return new Promise((resolve, reject) => {
    if (arr === null || arr === undefined && (Array.isArray(arr) && JSON.stringify(arr) === '[]')) {
      return resolve();
    }
    // 提示
    if (typeof callback === 'function') {
      callback();
    }
    return reject();
  });
}

/**
 * 断言{@code arr}为空数组
 * <pre>
 *   []         ->  false
 *   null       ->  false
 *   undefined  ->  false
 * </pre>
 * @param boo
 * @returns {Promise<unknown>}
 */
export function isNotEmpty(arr, callback) {
  return new Promise((resolve, reject) => {
    if (arr === null || arr === undefined || !Array.isArray(arr) || JSON.stringify(arr) === '[]') {
      // 提示
      if (typeof callback === 'function') {
        callback();
      }
      return reject();
    }
    return resolve();
  });
}

