const token = {
  accessToken: "c5fb140ad245487795c7eb7c2d807c7a",
  refreshToken: "e5c331341e4c4de281ca54000e003c93",
  accessExpires: "2022-08-27 15:43:27",
  refreshExpires: "2022-08-29 14:43:27",
}
const user = {
  id: 1,
  username: "admin",
  email: "email",
  phone: "phone",
  nickname: "超级管理员",
  roles:[{
    roleName: "ROLE_ADMIN",
    roleNameCn: "超级管理员"
  }]
}

module.exports = [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      console.log("mock")
      const user = '{"code":"0","clientMessage":"执行成功","serverMessage":null,"data":{"accessToken":"df4483fa790f4181b6325cce475d2231","refreshToken":"00d5afd9bd314c6caf8a31f0542132d0","accessExpires":"2022-08-27 21:39:51","refreshExpires":"2022-08-29 20:39:51","userId":1,"clientType":"browser","user":{"id":1,"deleted":false,"createUserId":1,"updateUserId":1,"updateTime":"2022-08-20 22:18:29","createTime":"2022-08-20 20:49:42","username":"admin","password":null,"email":"@admin","phone":"admin_phone","nickname":"超级管理员","remark":"系统预置超级管理员","validTime":"9999-12-31 23:59:59","qqOpenId":null,"roles":[{"roleName":"ROLE_ADMIN","roleNameCn":"超级管理员","remark":"系统预置"}],"menus":null,"sessionId":"df4483fa790f4181b6325cce475d2231"}},"dataMap":{},"timestamp":"2022-08-27 20:39:51"}'
      return JSON.parse(user)
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      return {
        "code": "0",
        "clientMessage": "执行成功",
        "data": {
          "id": "1",
          "deleted": false,
          "createUserId": "1",
          "updateUserId": "1",
          "updateTime": "2022-08-20 22:18:29",
          "createTime": "2022-08-20 20:49:42",
          "username": "admin",
          "email": "@admin",
          "phone": "admin_phone",
          "nickname": "超级管理员",
          "remark": "系统预置超级管理员",
          "validTime": "9999-12-31 23:59:59",
          "roles": [
            {
              "roleName": "ROLE_ADMIN",
              "roleNameCn": "超级管理员",
              "remark": "系统预置"
            }
          ],
          "sessionId": "8ecf93786af14f0ab9a0f6cbdf86b9cd"
        },
        "dataMap": {},
        "timestamp": "2022-08-27 21:08:38"
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'put',
    response: _ => {
      return {
        "code": "0",
        "clientMessage": "退出成功",
        "serverMessage": null,
        "data": null,
        "dataMap": {},
        "timestamp": "2022-08-27 22:06:32"
      }
    }
  }
]
