<template>
  <div class="comp-attendance">
    <div class="flex-row gap-4 hidden xl:flex">
      <IconCelandar></IconCelandar>
      <p class="text-body-3">
        {{ checked ? `Đã nhận ${checkInBonus} CP ngày hôm nay` : 'Điểm danh nhận CP' }}
      </p>
    </div>
    <a-button
      :disabled="checked"
      :loading="loading"
      type="primary"
      @click="handleCheckinUser"
      class="hidden xl:block"
      >{{ !checked ? `Nhận ngay ${checkInBonus} CP` : `Đã nhận ${checkInBonus} CP` }}</a-button
    >
    <a-button
      :loading="loading"
      :disabled="checked"
      type="primary"
      @click="handleCheckinUser"
      class="xl:hidden"
      >{{
        !checked ? `Điểm danh nhận ngay ${checkInBonus} CP` : `Đã nhận ${checkInBonus} CP hôm nay`
      }}
    </a-button>
  </div>
</template>
<script>
import { computed, ref } from 'vue'
import IconCelandar from '@/components/shared/icons/IconCelandar.vue'
import { checkinUser } from '@/api/user'
import { userStore } from '@/stores/userStore'
export default {
  components: {
    IconCelandar
  },
  setup() {
    const loading = ref(false)
    const checked = computed(() => {
      return userStore().userInfo?.checkedIn
    })
    const checkInBonus = computed(() => {
      return userStore().userInfo?.checkInBonus
    })
    const handleCheckinUser = async () => {
      loading.value = true
      try {
        const res = await checkinUser()
        if (res) {
          userStore().getUserInfo()
        }
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }
    return {
      loading,
      checked,
      checkInBonus,
      handleCheckinUser
    }
  }
}
</script>
<style>
.comp-attendance {
  width: 100%;
  display: flex;
  padding: 24px 0;
  flex-direction: column;
  gap: 22px;
  border-radius: 8px;
  @apply xl:max-w-[274px];
}

@media screen and (min-width: 1025px) {
  .comp-attendance {
    border: 1px solid #a1a1a1;
    padding: 24px 16px;
  }
}
</style>
