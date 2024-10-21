<template>
  <div class="layout-basic max-w-1920 flex flex-col mx-auto items-center pb-12">
    <header
      class="w-full fixed h-[60px] z-[1000] bg-neutral-900 flex flex-row items-center justify-between border-b border-neutral-700 border-solid padding-side-global"
    >
      <!--      <AppLogo class="max-w-[78px]"></AppLogo>-->
      <div class="layout-basic__title">
        <span class="!text-white hidden lg:flex text-heading-4 font-bold">{{
          $t(`${renderTitle}`)
        }}</span>
      </div>
      <AppLocale></AppLocale>
    </header>
    <div class="w-full padding-side-global flex justify-center pt-[74px]">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import AppLogo from '@/components/app/AppLogo.vue'
import AppLocale from '@/components/app/AppLocale.vue'
import router from '@/router'
import { computed, onMounted } from 'vue'
import { userStore } from '@/stores/userStore'
import { masterDataStore } from '@/stores/masterDataStore'

const renderTitle = computed(() => {
  return router.currentRoute.value.meta?.title
})

onMounted(async () => {
  await userStore().getUserInfo()
  await masterDataStore().getMasterData()
})
</script>
