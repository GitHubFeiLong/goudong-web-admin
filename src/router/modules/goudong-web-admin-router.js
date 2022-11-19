/** 自定义的菜单路由配置 **/

import Layout from '@/layout'

/**
 * 所有资源
 * @type {[{redirect: string, path: string, component: {components: {TagsView: {components: {ScrollPane: {data(): {left: number}, computed: {scrollWrapper(): *}, methods: {emitScroll(): void, handleScroll(*): void, moveToTarget(*): void}, name: string, beforeDestroy(): void, mounted(): void}}, data(): {visible: boolean, top: number, left: number, affixTags: [], selectedTag: {}}, computed: {routes(): *, visitedViews(): *}, watch: {visible(*): void, $route(): void}, methods: {refreshSelectedTag(*): void, openMenu(*, *): void, closeSelectedTag(*): void, moveToCurrentTag(): void, toLastView(*, *): void, isAffix(*): void, initTags(): void, handleScroll(): void, filterAffixTags(*, *=): [], isActive(*): boolean, closeMenu(): void, addTags(): boolean, closeAllTags(*): void, closeOthersTags(): void}, mounted(): void}, AppMain: {computed: {cachedViews(): *, key(): *}, name: string}, Navbar: {components: {Hamburger: {methods: {toggleClick(): void}, name: string, props: {isActive: {default: boolean, type: Boolean | BooleanConstructor}}}, Screenfull: {data(): {isFullscreen: boolean}, methods: {init(): void, change(): void, destroy(): void, click(): (boolean|undefined)}, name: string, beforeDestroy(): void, mounted(): void}, SizeSelect: {data(): {sizeOptions: [{label: string, value: string},{label: string, value: string},{label: string, value: string},{label: string, value: string}]}, computed: {size(): *}, methods: {refreshView(): void, handleSetSize(*): void}}, Search: {data(): {searchPool: [], fuse: *, search: string, options: [], show: boolean}, computed: {routes(): *}, watch: {routes(): void, searchPool(*): void, show(*): void}, methods: {generateRoutes(*, *=, *=): [], change(*): void, initFuse(*): void, querySearch(*): void, click(): void, close(): void}, name: string, mounted(): void}, Breadcrumb: {data(): {levelList: null}, watch: {$route(*): void}, created(): void, methods: {pathCompile(*): string, handleLink(*): void, isDashboard(*): boolean, getBreadcrumb(): void}}, ErrorLog: {data(): {dialogTableVisible: boolean}, computed: {errorLogs(): *}, methods: {clearAll(): void}, name: string}}, computed: {[p: string]: () => any}, methods: {logout(): Promise<void>, toggleSideBar(): void}}, RightPanel: {data(): {show: boolean}, computed: {theme(): *}, watch: {show(*): void}, methods: {addEventClick(): void, closeSidebar(*): void, insertToBody(): void}, name: string, beforeDestroy(): void, mounted(): void, props: {buttonTop: {default: number, type: Number | NumberConstructor}, clickNotClose: {default: boolean, type: Boolean | BooleanConstructor}}}, Settings: {components: {ThemePicker: {data(): {chalk: string, theme: string}, computed: {defaultTheme(): *}, watch: {defaultTheme: {handler: function(*, *): void, immediate: boolean}, theme(*): Promise<void>}, methods: {updateStyle(*, *, *): *, getThemeCluster(*): [*], getCSSString(*, *): Promise<unknown>}}}, data(): {}, computed: {fixedHeader: {set(*): void, get(): *}, sidebarLogo: {set(*): void, get(): *}, tagsView: {set(*): void, get(): *}}, methods: {themeChange(*): void}}, Sidebar: {components: {SidebarItem: {components: {Item: {functional: boolean, name: string, render(*, *): [], props: {icon: {default: string, type: String | StringConstructor}, title: {default: string, type: String | StringConstructor}}}, AppLink: {computed: {isExternal(): Boolean, type(): (string)}, methods: {linkProps(*): ({rel: string, href: *, target: string})}, props: {to: {type: String | StringConstructor, required: boolean}}}}, mixins: [{computed: {device(): *}, methods: {fixBugIniOS(): void}, mounted(): void}], data(): {}, methods: {hasOneShowingChild(*=, *): (boolean), resolvePath(*): (*)}, name: string, props: {item: {type: Object | ObjectConstructor, required: boolean}, isNest: {default: boolean, type: Boolean | BooleanConstructor}, basePath: {default: string, type: String | StringConstructor}}}, Logo: {data(): {logo: string, title: string}, name: string, props: {collapse: {type: Boolean | BooleanConstructor, required: boolean}}}}, computed: {[p: string]: () => any, showLogo(): *, variables(): *, activeMenu(): (default.computed.$route.meta.activeMenu), isCollapse(): void}}}, mixins: [{watch: {$route(*): void}, methods: {$_resizeHandler(): void, $_isMobile(): boolean}, beforeMount(): void, beforeDestroy(): void, mounted(): void}], computed: {[p: string]: () => any, classObj(): {hideSidebar, mobile: boolean, withoutAnimation: default.computed.sidebar.withoutAnimation, openSidebar: default.computed.sidebar.opened}}, methods: {handleClickOutside(): void}, name: string}, children: [{path: string, component: (function(): Promise<{readonly default?: {components: {UsernameSelect: function(): Promise<{readonly default?: {data(): {size: number, totalPage: *, usernames: [], page: number, loading: boolean, username: *}, methods: {loadUsername(): void, loadMore: function(): void, change(*): void}, mounted(): void}}>, CreateUserDialog: function(): Promise<{readonly default?: {components: {RoleSelect: function(): *}, data(): {visible: boolean, rules: {roleIds: [{trigger: string, type: string, message: string, required: boolean}], phone: [{validator: function(*, *, *): (*|undefined), trigger: string, required: boolean}], email: [{validator: function(*, *, *): (*|undefined), trigger: string, required: boolean}], username: [{validator: function(*, *, *): (*|undefined), trigger: string, required: boolean}]}, roleSelect: {roleMultiple: boolean}, user: {roleIds: [], phone: string, email: string, username: string}}, watch: {createUserDialog(): void}, methods: {getSelectRoleIds(*): void, submitForm(*): void, resetForm(*): void, close(): void}, name: string, props: {createUserDialog: {default: boolean, type: Boolean | BooleanConstructor, required: boolean}}}}>, EditUserDialog: function(): Promise<{readonly default?: {components: {RoleSelect: function(): *}, data(): {visible: boolean, rules: {roleIds: [{trigger: string, type: string, message: string, required: boolean}], phone: [{required: boolean}], validTime: [{trigger: string, message: string, required: boolean}], email: [{required: boolean}], username: [{required: boolean}]}, roleSelect: {roleMultiple: boolean, roles: []}, avatar: {avatarAction: string, dialogVisible: boolean, dialogImageUrl: string, fileList: []}, user: {roleIds: [], roleNameCn: string, phone: string, nickname: string, validTime: Date, remark: string, id: string, avatar: string, email: string, username: string}}, watch: {"avatar.fileList": function(*, *): void, editUserDialog(): void}, methods: {getSelectRoleIds(*): void, handleProgress(*, *, *): void, submitForm(*): void, handleChange(*, *): void, handleError(*, *, *): void, handlePictureCardPreview(*): void, beforeAvatarUpload(*): void, close(): void, handleAvatarSuccess(*, *, *): void, handleRemove(*, *): void}, name: string, props: {editUserInfo: {default: function(): {}, type: Object | ObjectConstructor, required: boolean}, editUserDialog: {default: function(): boolean, type: Boolean | BooleanConstructor, required: boolean}}}}>}, data(): {filter: {startValidTime: *, createTime: *, validTime: *, startCreateTime: *, endCreateTime: *, username: *, endValidTime: *}, editUserInfo: *, editUserDialog: boolean, createUserDialog: boolean, pickerOptions: {shortcuts: [{onClick(*): void, text: string},{onClick(*): void, text: string},{onClick(*): void, text: string}]}, checkUserIds: [], tableHeight: *, user: {total: number, pageSizes: *, size: number, totalPage: number, page: number, users: []}}, directives: {waves: {bind(*, *): void, unbind(*): void, update(*, *): void}}, methods: {filterTimeHandler(): void, addUser(): void, editUser(*): void, selectionChangeFunc(*): void, closeEditUserDialog(): void, searchFunc(): void, getUsername(*): void, exportExcel(): void, handleSizeChange(*): void, deleteUser(*): void, tableRowClassName({row: *, rowIndex: *}): (string), handleCurrentChange(*): void, loadPageUser(): void}, name: string, mounted(): void}}>), children: [{path: string, method: string, hidden: boolean, name: string, api: boolean},{path: string, method: string, hidden: boolean, name: string, api: boolean},{path: string, method: string, hidden: boolean, name: string, api: boolean},{path: string, method: string, hidden: boolean, name: string, api: boolean},{path: string, method: string, hidden: boolean, name: string, api: boolean}], meta: {roles: string[], title: string}, name: string},{path: string, component: (function(): Promise<{readonly default?: {components: {EditRoleDialog: function(): Promise<{readonly default?: {data(): {visible: boolean, role: {roleNameCn: string, remark: string}, rules: {roleNameCn: [{min: number, max: number, trigger: string, message: string, required: boolean}], remark: [{max: number, message: string, required: boolean, triangle: string}]}}, watch: {editRoleDialog(): void}, methods: {submitForm(*): void, resetForm(*): void, close(): void}, name: string, props: {editRoleInfo: {default: function(): {}, type: Object | ObjectConstructor, required: boolean}, editRoleDialog: {default: function(): boolean, type: Boolean | BooleanConstructor, required: boolean}}}}>, EditRoleMenuDialog: function(): Promise<{readonly default?: {data(): {visible: boolean, defaultCheckedKeys: [string], menus: [], checkStrictly: boolean, props: {children: string, label: string}}, watch: {editRoleMenuDialog(): void}, methods: {submit(): void, reset(): void, getCheckedId(*): *, close(): void, demo(*): *}, name: string, props: {editRoleMenuInfo: {default: function(): {}, type: Object | ObjectConstructor, required: boolean}, editRoleMenuDialog: {default: function(): boolean, type: Boolean | BooleanConstructor, required: boolean}}}}>, CreateRoleDialog: function(): Promise<{readonly default?: {data(): {visible: boolean, role: {roleNameCn: string, remark: string}, rules: {roleNameCn: [{min: number, max: number, trigger: string, message: string, required: boolean}], remark: [{max: number, message: string, required: boolean, triangle: string}]}}, watch: {createRoleDialog(): void}, methods: {submitForm(*): void, resetForm(*): void, close(): void}, name: string, props: {createRoleDialog: {default: function(): boolean, type: Boolean | BooleanConstructor, required: boolean}}}}>}, data(): {filter: {roleNameCn: *}, editRoleMenuInfo: {}, editRoleInfo: *, role: {total: number, pageSizes: *, size: *, totalPage: number, roles: [], page: number}, editRoleMenuDialog: boolean, createRoleDialog: boolean, editRoleDialog: boolean, tableHeight: *}, directives: {waves: {bind(*, *): void, unbind(*): void, update(*, *): void}}, methods: {initMenu(): void, loadPageRole(): void, handleSizeChange(*): void, searchFunc(): void, editRole(*): void, generate(*): {path: *, method: *, name: *, api: *}, deleteRole(*): void, handleCurrentChange(*): void, addRole(): void, editRoleMenu(*): void}, name: string, mounted(): void}}>), children: [{path: string, method: string, hidden: boolean, name: string, api: boolean},{path: string, method: string, hidden: boolean, name: string, api: boolean},{path: string, method: string, hidden: boolean, name: string, api: boolean},{path: string, method: string, hidden: boolean, name: string, api: boolean},{path: string, method: string, hidden: boolean, name: string, api: boolean}], meta: {roles: string[], title: string}, name: string}], meta: {roles: string[], icon: string, title: string}, name: string, alwaysShow: boolean}]}
 */
export const goudongWebAdminResource = [
  {
    path: '/user',
    name: '系统管理',
    component: Layout,
    redirect: '/user/page',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '系统管理',
      icon: 'peoples',
      roles: ['ROLE_ADMIN'] // you can set roles in root nav
    },
    children: [
      {
        path: '/usr/page',
        component: () => import('@/views/user/index'),
        name: '用户管理', // 使用name属性，才有面包屑
        meta: {
          title: '用户管理',
          roles: ['ROLE_ADMIN'] // or you can only set roles in sub nav
        },
        children: [
          {
            name: '查询',
            api: true, // 是否是接口
            path: '/api/user/base-user/page',
            method: 'get',
            hidden: true,
          },
          {
            name: '新增',
            api: true, // 是否是接口
            path: '/api/user/base-user/simple-create-user',
            method: 'post',
            hidden: true,
          },
          {
            name: '导出',
            api: true, // 是否是接口
            path: '/api/user/base-user/export',
            method: 'get',
            hidden: true,
          },
          {
            path: '/api/user/base-user/admin/user',
            api: true, // 是否是接口
            name: '编辑',
            method: 'put',
            hidden: true,
          },
          {
            path: '/api/user/base-user/*',
            api: true, // 是否是接口
            name: '删除',
            method: 'delete',
            hidden: true,
          },
        ]
      },
      {
        path: '/user/role',
        component: () => import('@/views/role/index'),
        name: '角色管理', // 使用name属性，才有面包屑
        meta: {
          title: '角色管理',
          roles: ['ROLE_ADMIN'] // or you can only set roles in sub nav
        },
        children: [
          {
            name: '查询',
            api: true, // 是否是接口
            path: '/api/user/base-role/page',
            method: 'get',
            hidden: true,
          },
          {
            name: '新增',
            api: true, // 是否是接口
            path: '/api/user/base-role',
            method: 'post',
            hidden: true,
          },
          {
            name: '编辑',
            api: true, // 是否是接口
            path: '/api/user/base-role',
            method: 'put',
            hidden: true,
          },
          {
            name: '删除',
            api: true, // 是否是接口
            path: '/api/user/base-role/*',
            method: 'delete',
            hidden: true,
          },
          {
            name: '权限',
            api: true, // 是否是接口
            path: '/api/user/base-role/permissions/*',
            method: 'post',
            hidden: true,
          }
        ]
      },
      {
        path: '/user/menu',
        component: () => import('@/views/menu/index'),
        name: '菜单管理',
        meta: {
          title: '菜单管理'
        },
        children: [
          {
            name: '查询',
            api: true, // 是否是接口
            path: '/api/user/base-menu/tree',
            method: 'get',
            hidden: true,
          }
        ]
      }
    ]
  },
  // 必须放在最后 404
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 路由资源
 * @type {T[]}
 */
export const goudongWebAdminRouters = getRouters()

/**
 * 对所有资源中的api进行过滤，只返回路由资源
 * @returns {T[]}
 */
function getRouters() {
  // 复制
  const copy = deepCopy(goudongWebAdminResource)
  const routers = copy.filter(menu => {
    // 有children
    if (menu.children) {
      // 修改children，过滤掉 api
      menu.children = filterChildren(menu.children)
      if (menu.children.length === 0) {
        menu.children = undefined
      }
      return true
    }
    if (menu.api) {
      return false
    }
    return true
  })

  return copy;
}

/**
 * 深拷贝
 * @param source
 * @returns {[]|{}|*}
 */
function deepCopy(source) {
  if (typeof source !== "object") {
    return source;
  }
  if (source == null) {
    return source;
  }
  var newObj = source.constructor === Array ? [] : {}; // 开辟一块新的内存空间
  for (var i in source) {
    newObj[i] = deepCopy(source[i]);
  }
  return newObj;
}

/**
 * 过滤子节点
 * @param menus
 * @returns {*}
 */
function filterChildren(menus) {
  return menus.filter(menu => {
    // api的过滤掉
    if (menu.api) {
      return false
    }
    // 有children
    if (menu.children) {
      // 递归修改children
      menu.children = filterChildren(menu.children)
      if (menu.children.length === 0) {
        menu.children = undefined
      }
      return true
    }

    return true
  })
}
