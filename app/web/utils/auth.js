import Cookies from 'js-cookie'

const TokenKey = 'center-manage-token'

export function getCookie(cName) {
  return Cookies.get(cName)
}
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeCookie(name) {
  return Cookies.remove(name)
}