import LayoutSidebar from '@/layout/LayoutSidebar.vue'
import LayoutNoSidebar from '@/layout/LayoutNoSidebar.vue'
import LayoutAiArt from '@/layout/LayoutAiArt.vue'
import HomeView from '@/views/page/profile/kyc.vue'
import Tomxu from '@/views/page/tomxu/index.vue'
import PageNotFound from '@/views/Page-not-found/index.vue'
import AiChat from '@/views/page/ai-chat/index.vue'
import AiArt from '@/views/page/ai-art/index.vue'
import AiArtTrial from '@/views/page/ai-art/AiArtTrial.vue'
import ComingSoon from '@/components/app/ComingSoon.vue'
import NetworkPage from '@/views/page/network/index.vue'
import IncomeDetails from '@/views/page/network/income_details.vue'
import Authentication from '@/views/page/authentication/index.vue'
import FeedView from '@/views/page/home/feed.vue'
import MaintenancePage from '@/views/MaintenancePage.vue'
import MemberPackage from '@/views/page/member-package/index.vue'
import PostDetailPage from '@/views/page/post/PostDetailPage.vue'
import ProfileUser from '@/views/page/profile/ProfileUser.vue'
import NotificationPage from '@/views/page/NotificationPage.vue'
import Helper from '@/views/page/helper/index.vue'
import HelperDetail from '@/views/page/helper/HelpDetail.vue'
import MessagePage from '@/views/page/message/index.vue'
import ShareFun from '@/views/page/share-fund/index.vue'
import StorePreview from '@/components/store/StorePreview.vue'
import Redirect from '@/components/redirect/Redirect.vue'

const modulesRoute = [
  {
    path: '',
    name: 'layout-sidebar',
    component: LayoutSidebar,
    meta: {
      requiresAuth: true
    },
    redirect: '',
    children: [
      {
        path: '',
        name: 'feed',
        component: FeedView
      },
      {
        path: '/discover',
        name: 'discover',
        component: Redirect
      },
      {
        path: '/notification',
        name: 'notification',
        component: NotificationPage
      },
      {
        path: '/message',
        name: 'message',
        component: Redirect
      },
      {
        path: '/member',
        name: 'member',
        component: MemberPackage
      },
      {
        path: '/share-fund',
        name: 'share-fund',
        component: ShareFun
      },
      {
        path: '/store',
        name: 'store',
        component: StorePreview
      },
      {
        path: '/map',
        name: 'map',
        component: ComingSoon
      },
      {
        path: '/search',
        name: 'search',
        component: Redirect
      },
      {
        path: '/products-docs',
        name: 'products-docs',
        component: Redirect
      },
      {
        path: '/people',
        name: 'people',
        component: Redirect
      },
      {
        path: '/group',
        name: 'group',
        component: Redirect
      },
      {
        path: '/work',
        name: 'work',
        component: Redirect
      },
      {
        path: '/support',
        name: 'support',
        component: Helper
      },
      {
        path: '/support-detail',
        name: 'support-detail',
        component: HelperDetail
      },
      {
        path: '/post/:slug',
        name: 'PostDetail',
        component: PostDetailPage
      },
      {
        path: '/:pathMatch(.*)*',
        component: PageNotFound,
        alias: 'page-not-found'
      }
    ]
  },
  {
    path: '',
    name: 'layout-no-sidebar',
    title: 'layout.menu_main.profile',
    component: LayoutNoSidebar,
    redirect: '/profile',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/kyc',
        name: 'kyc',
        component: HomeView
      },
      {
        path: '/network',
        name: 'network',
        component: NetworkPage
      },
      {
        path: '/income-details',
        name: 'IncomeDetails',
        component: IncomeDetails
      },
      {
        path: 'tomxu-manager',
        name: 'tomxu-manager',
        component: Tomxu
      },
      {
        path: '/:username',
        name: 'ProfileUser',
        component: ProfileUser
      }
    ]
  },
  {
    path: '/system/maintenance',
    name: 'Maintenance',
    component: MaintenancePage
  },
  {
    path: '/authenticator',
    name: 'authenticator',
    component: LayoutNoSidebar,
    redirect: '/authenticator',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'authenticator',
        component: Authentication
      }
    ]
  },
  {
    path: '/',
    name: 'tom-art',
    component: LayoutAiArt,
    redirect: '/tom-art',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'tom-avatar',
        name: 'tom-avatar',
        component: AiArtTrial
      },
      {
        path: 'tom-art',
        name: 'tom-art',
        component: AiArt
      }
    ]
  },
  {
    path: '/',
    name: 'tom-chat',
    component: LayoutAiArt,
    redirect: '/tom-chat',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'tom-chat',
        name: 'tom-chat',
        component: AiChat
      }
    ]
  }
]

export default modulesRoute
