import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../helper/http/cookie'
import { userStore } from '@/stores/userStore'
import modulesRoute from '@/router/moduleRoutes.js'
export const ROOT_ROUTE = 'feed'
export const LOGIN_ROUTE = 'login'
export const LOGOUT_ROUTE = 'logout'
export const PAGE_NOT_FOUND = 'page-not-found'
export const AUTH_ROUTE = [
  'login',
  'register-form',
  'register',

  'validate-email',
  'register-2fa',
  'register-kyc',
  'recover',
  'identify',
  'reset'
]

const ROUTE_GET_PROFILE_REQUIRE = ['kyc', 'ai-chat']

const authModule = import.meta.globEager('./auth/*.js')
const routeAuthList = []
Object.keys(authModule).forEach((key) => {
  const mod = authModule[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeAuthList.push(...modList)
})

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [...modulesRoute, ...routeAuthList]
})

const VITE_BASE_IS_MAINTENANCE = import.meta.env.VITE_BASE_IS_MAINTENANCE
router.beforeEach(async (to, from, next) => {
  if (ROUTE_GET_PROFILE_REQUIRE.includes(to.name)) {
    await userStore().getUserInfo()
  }

  const isTokenValid = getToken()
  const isAuthRoute = AUTH_ROUTE.includes(to.name)
  const isKycRoute = to.name === 'kyc'
  const isAiRoute = ['ai-chat', 'ai-art'].includes(to.name)

  if (!isTokenValid && !isAuthRoute) {
    if (VITE_BASE_IS_MAINTENANCE === '1') {
      next()
    } else {
      next({ name: LOGIN_ROUTE })
    }
  } else if (isTokenValid && isAuthRoute) {
    next({ name: ROOT_ROUTE })
  } else if (isKycRoute) {
    if (userStore().userInfo.kycStatus === 'approved') {
      next({ name: ROOT_ROUTE })
    } else {
      next()
    }
  } else if (isAiRoute) {
    if (userStore().checkPackageExpired) {
      next()
    } else {
      next({ name: ROOT_ROUTE })
    }
  } else {
    next()
  }
})

export default router
