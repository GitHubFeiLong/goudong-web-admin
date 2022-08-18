import request from '@/utils/request'

export function login(data) {
  return request({
    url: `/api/oauth2/authentication/login?username=${data.username}&password=${data.password}`,
    method: 'post'
  })
}

export function refresh(refreshToken) {
  return request({
    url: `/api/oauth2/authentication/refresh-token?refreshToken=${refreshToken}`,
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/api/oauth2/authentication/current-user-info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/oauth2/authentication/logout',
    method: 'put'
  })
}
