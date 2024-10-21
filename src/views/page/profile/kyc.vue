<template>
  <div class="page-club w-full flex max-w-[1920px] padding-side-global pb-8 md:pb-24 pt-6 md:pt-12">
    <div class="mx-auto w-full flex w-full max-w-[420px] flex-col gap-5 items-center">
      <KycComponent class="m-auto" />
    </div>
  </div>
</template>
<script>
import KycComponent from '@/components/user/KycComponent.vue'
import { userStore } from '@/stores/userStore'
import router from '@/router'
import { computed, onMounted, watch } from 'vue'
import { KEY_SUPPORT, supportStore } from '@/stores/support'

export default {
  name: 'PageKyc',
  components: { KycComponent },
  setup() {
    const checkKycUser = computed(() => {
      return userStore().userInfo.kycStatus === 'approved'
    })
    const checkKyc = () => {
      console.log(111)
      if (userStore().userInfo.kycStatus === 'approved') {
        router.push({
          name: 'profile'
        })
      }
    }
    onMounted(() => {
      checkKyc()
      supportStore().setKey(KEY_SUPPORT.KYC)
    })
    watch(
      () => checkKycUser.value,
      () => {
        checkKyc()
      }
    )
    return {}
  }
}
</script>
