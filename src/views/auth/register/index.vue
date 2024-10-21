<template>
  <div class="register-page w-full flex pb-8">
    <div class="w-full max-w-[400px] mx-auto mt-[29px]">
      <div class="register-page__step w-full grid grid-cols-2 gap-3">
        <div
          v-for="item in 2"
          :key="item + 'step'"
          :class="['h-1 w-full', item <= step ? 'bg-gold-150' : 'bg-neutral-600']"
        ></div>
      </div>
      <div class="register-page__tab">
        <div class="w-full mt-[28px] mb-[40px] flex flex-row items-center justify-between">
          <div
            v-if="['validate-email'].includes(currentRoute)"
            class="w-6 cursor-pointer h-6 group flex rounded-lg"
            @click="handleDirectBack"
          >
            <IconArrowLeftGold class="m-auto h-9 group-hover:scale-110"></IconArrowLeftGold>
          </div>
          <div class="w-3"></div>
        </div>
        <h1 class="text-heading-2 text-gradient mb-6">{{ $t('register.title') }}</h1>
        <transition name="slide-fade">
          <router-view></router-view>
        </transition>
        <a-button
          type="gray"
          v-if="['register-2fa', 'register-kyc'].includes(currentRoute)"
          class="cursor-pointer flex w-full py-4 mt-4 w-fit px-10 rounded-lg bg-white-01"
          @click="directSkip"
        >
          <span class="m-auto text-body-4 !text-gold-150 !font-bold">{{ $t('common.skip') }}</span>
        </a-button>
        <div class="flex flex-row justify-center mt-10">
          <span class="mr-2 text-neutral-400">{{ $t('register.have_account') }}</span>
          <p
            class="text-gold-150 cursor-pointer hover:underline transition-500"
            @click="directLogin"
          >
            {{ $t('login.title') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import router from '@/router'
import { computed } from 'vue'
import { removeTokenAuth } from '@/helper/http/cookie'
import ButtonBack from '@/components/app/ButtonBack.vue'
import IconArrowLeftGold from '@/components/shared/icons/IconArrowLeftGold.vue'
export default {
  name: 'RegisterPage',
  components: {
    ButtonBack,
    IconArrowLeftGold
  },
  setup() {
    const step = computed(() => {
      switch (router.currentRoute.value.name) {
        case 'register-form':
          return 1
        case 'validate-email':
          return 2
        case 'register-2fa':
          return 3
        case 'register-kyc':
          return 4
        default:
          return 4
      }
    })

    const currentRoute = computed(() => {
      return router.currentRoute.value.name
    })
    const handleDirectBack = () => {
      switch (router.currentRoute.value.name) {
        case 'register-form':
          router.push({
            name: 'login'
          })
          break
        case 'validate-email':
          router.push({
            name: 'register-form'
          })
          break
        case 'register-kyc':
          router.push({
            name: 'register-2fa'
          })
          break
        default:
          break
      }
    }

    const directSkip = () => {
      switch (router.currentRoute.value.name) {
        case 'register-2fa':
          router.push({
            name: 'register-kyc'
          })
          break
        case 'register-kyc':
          removeTokenAuth()
          router.push({
            name: 'login'
          })
          break
        default:
          break
      }
    }
    const directLogin = () => {
      router.push({
        name: 'login'
      })
    }

    return { step, directSkip, directLogin, currentRoute, handleDirectBack }
  }
}
</script>
