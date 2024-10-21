import LayoutWhite from '@/layout/LayoutWhite.vue'
import LoginPage from '@/views/auth/login/LoginPage.vue'

const login = {
  path: '/',
  name: 'login',
  title: 'Login',
  component: LayoutWhite,
  redirect: '/login',
  hideMenu: true,
  meta: {
    requiresAuth: false
  },
  children: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    }
  ]
}

export default login
