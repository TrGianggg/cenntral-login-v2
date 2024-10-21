import LayoutWhite from '@/layout/LayoutWhite.vue'
import Register from '@/views/auth/register/index.vue'
import EnterForm from '@/views/auth/register/EnterForm.vue'
import GetOtpMail from '@/views/auth/register/GetOtpMail.vue'
import Code2Fa from '@/views/auth/register/Code2Fa.vue'
import Kyc from '@/views/auth/register/TabKyc.vue'

const registerChildren = [
  {
    path: 'form',
    name: 'register-form',
    component: EnterForm
  },
  {
    path: 'validate-email',
    name: 'validate-email',
    component: GetOtpMail
  }
]

const register = {
  path: '/',
  name: 'register',
  title: 'Register',
  component: LayoutWhite,
  redirect: '/register',
  hideMenu: true,
  meta: {
    requiresAuth: false
  },
  children: [
    {
      path: '/register',
      name: 'register',
      redirect: '/register/form',
      component: Register,
      children: registerChildren
    }
  ]
}

export default register
