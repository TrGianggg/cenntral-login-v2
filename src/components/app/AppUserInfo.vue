<template>
  <div class="flex gap-3 justify-between items-center">
    <router-link
      v-if="!hideInfo && userInfo && userInfo.username"
      :to="{
        name: 'ProfileUser',
        params: {
          username: userInfo.username
        }
      }"
      class="flex gap-3 cursor-pointer items-center w-full flex-1"
    >
      <div class="flex flex-col">
        <div class="font-bold text-white text-body-4 line-clamp-2">
          {{ userInfo?.firstName }} {{ userInfo?.lastName }}
        </div>
        <span class="text-body-4 text-neutral-400">@{{ userInfo?.username }}</span>
      </div>
      <AvatarUser :src="userInfo?.profileImage" />
    </router-link>
    <a-popover
      v-model:visible="visible"
      trigger="click"
      :placement="placement"
      overlayClassName="cs-popup"
    >
      <template #content>
        <div class="flex flex-col py-3">
          <div
            @click="directPage('support')"
            class="select-item"
          >
            <IconHelp />
            <span>{{ 'Hướng dẫn sử dụng' }}</span>
          </div>
          <div
            @click="directPage('authenticator')"
            class="select-item"
          >
            <IconAuthenticator />
            <span>{{ genTitle2Fa }}</span>
          </div>
          <div
            @click="directChangePassword"
            class="select-item"
          >
            <IconChangePassword />
            <span>{{ $t('common.change_password') }}</span>
          </div>
          <div @click="() => (visible = false)">
            <ModalEditInfo> </ModalEditInfo>
          </div>
          <div
            class="select-item"
            @click="logOut"
          >
            <IconLogout />
            <span>{{ $t('common.logout') }}</span>
          </div>
          <div class="select-item-base">
            <ToggleTheme />
          </div>
        </div>
      </template>
      <HoverBox>
        <IconMore @click="() => (visible = true)" />
      </HoverBox>
    </a-popover>
  </div>
</template>
<script setup>
import { logOut } from '@/helper'
import { computed, defineProps, ref } from 'vue'
import { userStore } from '@/stores/userStore'
import router from '@/router'
import { useI18n } from 'vue-i18n'
import IconChangePassword from '@/components/shared/icons/IconChangePassword.vue'
import IconHelp from '@/components/shared/icons/IconHelp.vue'
import IconLogout from '@/components/shared/icons/IconLogout.vue'
import IconAuthenticator from '@/components/shared/icons/IconAuthenticator.vue'
import AvatarUser from '@/components/shared/AvatarUser.vue'
import HoverBox from '@/components/shared/HoverBox.vue'
import IconMore from '@/components/shared/icons/IconMore.vue'
import ToggleTheme from '@/components/shared/ToggleTheme.vue'
import IconEdit from '@/components/shared/icons/IconEdit.vue'
import ModalEditInfo from '@/components/app/ModalEditInfo.vue'
//

const props = defineProps({
  hideInfo: {
    type: Boolean,
    default: false
  }
})
const visible = ref(false)
const { t } = useI18n()
const store = userStore()
const userInfo = computed(() => store.userInfo)
const windowWidth = window.innerWidth
const placement = ref('top')
if (windowWidth < 1024) {
  placement.value = 'topRight'
}

const genTitle2Fa = computed(() => {
  switch (userInfo.value.twoFaEnabled) {
    case null:
      return t('common.authenticator')
    case false:
      return t('common.turn_on_authenticator')
    default:
      return t('common.turn_off_authenticator')
  }
})
const directChangePassword = () => {
  router.push({
    name: 'change-password'
  })
}

const directChange2fa = () => {
  router.push({
    name: 'authenticator'
  })
}
const directPage = (name) => {
  visible.value = false
  router.push({
    name: name
  })
}

const editInfo = () => {}
</script>
