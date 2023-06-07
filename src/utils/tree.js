/**
 * 菜单排除api
 */
export function excludeApi(menus) {
  // 将菜单中的接口过滤
  const arr2 = [];
  menus.forEach(function(val, index, arr) {
    if (val.type !== 0 && Reflect.has(val, 'children')) {
      const obj = { id: val.id, name: val.name, children: [] };
      excludeChildrenApi(val.children, obj.children);
      arr2.push(obj)
    }
  })
  return arr2;
}

export function loadView(view) {
  if (view === '/user/index') {
    // 路由懒加载
    return resolve => require([`@/views/${view}`], resolve)
    // return () => import(`@/views${view}`);
  }
  return null;
}

/**
 * 排除子节点api
 * @param children
 * @param arr2
 */
function excludeChildrenApi(children, arr2) {
  if (children && children.length > 0) {
    children.forEach(function(val, index, arr) {
      if (val.type !== 0 && Reflect.has(val, 'children')) {
        const obj = { id: val.id, name: val.name, children: [] };
        excludeChildrenApi(val.children, obj.children);
        arr2.push(obj)
      }
    })
  }
}

