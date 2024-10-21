import Cookies from 'js-cookie'

const TokenKey = 'access_token'
const TokenAuthKey = 'access_token_auth'
const TokenShopKey = 'access_token_shop'
const TypeKey = 'type'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getTokenAuth() {
  return Cookies.get(TokenAuthKey)
}

export function getHashTokenShop() {
  return Cookies.get(TokenShopKey)
}
export function getType() {
  return Cookies.get(TypeKey)
}

export function setTokenAuth(token) {
  return Cookies.set(TokenAuthKey, token)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setHashTokenShop(token) {
  return Cookies.set(TokenShopKey, token)
}
export function setType(type) {
  return Cookies.set(TypeKey, type)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeTokenAuth() {
  return Cookies.remove(TokenAuthKey)
}

export function removeHashTokenShop() {
  return Cookies.remove(TokenShopKey)
}
export function removeType() {
  return Cookies.remove(TypeKey)
}
