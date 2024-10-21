<template>
  <div
    :style="`background:${bgTag}`"
    class="h-[28px] px-3 rounded-[53px] flex"
  >
    <span
      class="text-body-4 m-auto tag-label-text"
      :style="`color:${LIST_TYPE_TAGS[type]?.color || '#F0C428'}; white-space: nowrap;`"
      >{{ LIST_TYPE_TAGS[type]?.label || type }}</span
    >
  </div>
</template>
<script setup>
import { useThemeStore } from '@/stores/themeStore'
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'receiver'
  }
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDarkStore)

const bgTag = computed(() => {
  if (isDark.value) {
    return LIST_TYPE_TAGS[props.type]?.background || 'rgba(240, 196, 40, 0.1)'
  }
  return LIST_TYPE_TAGS[props.type]?.backgroundLight || '#F0C428'
})

const LIST_TYPE_TAGS = {
  signup_bonus: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Thưởng đăng ký'
  },
  signup_bonus_f1: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Thưởng giới thiệu F1'
  },
  signup_bonus_f2: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Thưởng giới thiệu F2'
  },
  user_refund_vault: {
    color: '#FF967F',
    background: 'rgba(169, 138, 132, 0.1)',
    backgroundLight: '#FF967F',
    label: 'Chuyển tiền về Quỹ đồng chia'
  },
  vault_refund: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Quỹ nhận tiền'
  },
  vault_distribute: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Quỹ chia tiền'
  },
  vault_distribute_redeem: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Nhận thưởng từ Quỹ đồng chia'
  },
  buy_package: {
    color: '#7FBAFF',
    background: 'rgba(127, 186, 255, 0.1)',
    backgroundLight: '#7FBAFF',
    label: 'Mua gói thành viên'
  },
  daily_bonus: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Thưởng hàng ngày'
  },
  auto_change_ptomxu_tomxu: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Tự động chuyển đổi P'
  },
  auto_change_ptomxu_tomxu_redeem: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Nhận CP từ chuyển đổi tự động P'
  },
  send_token: {
    color: '#FF967F',
    background: 'rgba(169, 138, 132, 0.1)',
    backgroundLight: '#FF967F',
    label: 'Chuyển CP'
  },
  revoke_ptomxu: {
    color: '#FF967F',
    background: 'rgba(169, 138, 132, 0.1)',
    backgroundLight: '#FF967F',
    label: 'Thu hồi P'
  },
  receive_token: {
    color: '#229314',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#229314',
    label: 'Nhận token'
  },
  com_f1: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 1'
  },
  com_f2: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 2'
  },
  com_f3: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 3'
  },
  com_f4: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 4'
  },
  com_f5: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 5'
  },
  com_f6: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 6'
  },
  com_f7: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 7'
  },
  com_f8: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 8'
  },
  com_f9: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 9'
  },
  com_f10: {
    color: '#7fffc5',
    background: 'rgba(132,169,139,0.1)',
    backgroundLight: '#7fffc5',
    label: 'Hoàn phí từ Nhóm 10'
  },

  passive_f1_lv1: {
    color: '#ffc37f',
    background: 'rgba(169,159,132,0.1)',
    backgroundLight: '#F0C428',
    label: 'Thu nhập trưởng nhóm LV1'
  },

  passive_f1_lv2: {
    color: '#ffc37f',
    background: 'rgba(169,159,132,0.1)',
    backgroundLight: '#F0C428',
    label: 'Thu nhập trưởng nhóm LV2'
  },

  reward_register: {
    color: '#F0C428',
    background: 'rgba(240, 196, 40, 0.1)',
    backgroundLight: '#F0C428',
    label: 'Thưởng đăng ký'
  },

  change_ptomxu_tomxu: {
    color: '#229314',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#229314',
    label: 'Chuyển đổi token P -> CP'
  },
  change_ptomxu_tomxu_redeem: {
    color: '#229314',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#229314',
    label: 'CP nhận từ chuyển đổi P'
  },

  reward_commission: {
    color: '#F0C428',
    background: 'rgba(240,196,40,0.09)',
    backgroundLight: '#F0C428',
    label: 'Thưởng hoa hồng'
  },
  busy: {
    color: '#F0C428',
    background: 'rgba(240, 196, 40, 0.1)',
    backgroundLight: '#F0C428',
    label: 'Busy'
  },
  online: {
    color: '#91FF7F',
    background: 'rgba(145, 255, 127, 0.1)',
    backgroundLight: '#91FF7F',
    label: 'Online'
  },
  offline: {
    color: '#BFBFBF',
    background: 'rgba(191, 191, 191, 0.1)',
    backgroundLight: '#BFBFBF',
    label: 'Offline'
  }
}
</script>

<style scoped lang="scss">
.light-theme {
  .tag-label-text {
    color: var(--color-white) !important;
  }
}
</style>
