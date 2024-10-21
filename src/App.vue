<template>
  <a-config-provider :locale="viVN">
    <div id="scroll-top"></div>
    <RouterView></RouterView>
  </a-config-provider>
  <PreviewImageModal />
  <ToggleTheme class="hidden" />
</template>
<script setup>
import viVN from 'ant-design-vue/es/locale/vi_VN'
import PreviewImageModal from '@/components/shared/PreviewImageModal.vue'
import ToggleTheme from '@/components/shared/ToggleTheme.vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'

import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { VAPID_KEY } from '@/helper/const'
import { userStore } from '@/stores/userStore'

let vh = window.innerHeight * 0.01
let vw = window.innerWidth * 0.01
document.documentElement.style.setProperty('--vh', `${vh}px`)
document.documentElement.style.setProperty('--vw', `${vw}px`)

// fix error 100vh in safari
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01
  let vw = window.innerWidth * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  document.documentElement.style.setProperty('--vw', `${vw}px`)
})

// const initFireBase = () => {
//   try {
//     initializeApp({
//       apiKey: 'AIzaSyCUnDuaii5ZyYGcYpv1afxaVkyicualeJ8',
//       authDomain: 'tomiru-4ae93.firebaseapp.com',
//       projectId: 'tomiru-4ae93',
//       storageBucket: 'tomiru-4ae93.appspot.com',
//       messagingSenderId: '763283167374',
//       appId: '1:763283167374:web:6a80b2dce4339d94eed1df',
//       measurementId: 'G-YZZK92B2WK'
//     })
//     const messaging = getMessaging()

//     getToken(messaging, { vapidKey: VAPID_KEY })
//       .then((currentToken) => {
//         if (currentToken) {
//           localStorage.setItem('clientId', currentToken)
//         } else {
//           console.log('No registration token available. Request permission to generate one.')
//         }
//       })
//       .catch((err) => {
//         localStorage.setItem('clientIdError', err.toString())
//       })
//   } catch (e) {
//     console.log(e)
//   }
// }

// initFireBase()

const route = useRoute()

watch(
  route,
  async () => {
    const VITE_BASE_IS_MAINTENANCE = import.meta.env.VITE_BASE_IS_MAINTENANCE
    if (VITE_BASE_IS_MAINTENANCE === '1') {
      router.push({ name: 'Maintenance' })
    }
    if (
      route.name !== 'login' &&
      route.name !== undefined &&
      route.name !== 'register-form' &&
      route.name !== 'identify'
    ) {
      const data = await userStore().getUserInfo()

      if (!data) {
        router.push({ name: 'login' })
      }
      data && userStore().setUserInfo(data)
    }
  },
  { immediate: true }
)
onMounted(() => {
  if (!Notification) {
    console.log('Desktop notifications are not available in your browser.')
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }
})
</script>
