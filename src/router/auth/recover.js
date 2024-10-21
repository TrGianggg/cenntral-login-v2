import LayoutWhite from '@/layout/LayoutWhite.vue'
import ForgotPassword from '@/views/auth/forgot-password/RecoverPassword.vue'
import IdentifyMail from '@/views/auth/forgot-password/IdentifyMail.vue'
import ResetPassword from '@/views/auth/forgot-password/ResetPassword.vue'

const recoverChildren = [
  {
    path: 'identify',
    name: 'identify',
    component: IdentifyMail
  },
  {
    path: 'reset',
    name: 'reset',
    component: ResetPassword
  }
]
const recover = {
  path: '/',
  name: 'recover',
  title: 'Recover',
  component: LayoutWhite,
  redirect: '/recover',
  hideMenu: true,
  meta: {
    requiresAuth: false
  },
  children: [
    {
      path: '/recover',
      name: 'recover',
      redirect: '/recover/identify',
      component: ForgotPassword,
      children: recoverChildren
    }
  ]
}

export default recover
