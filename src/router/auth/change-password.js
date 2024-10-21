import LayoutWhite from '@/layout/LayoutWhite.vue'
import ChangePassword from '@/views/auth/change-password/index.vue'

const changePassword = {
  path: '/',
  name: 'change-password',
  component: LayoutWhite,
  redirect: '/change-password',
  meta: {
    requiresAuth: true
  },
  children: [
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePassword
    }
  ]
}

export default changePassword
