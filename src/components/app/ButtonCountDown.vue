<template>
  <button
    type="button"
    class="btn btn-primary"
    :disabled="counting"
    @click="startCountdown"
  >
    <vue-countdown
      v-if="counting"
      :time="Number(timingCount)"
      @end="onCountdownEnd"
      v-slot="{ totalSeconds }"
      >Gửi lại mã sau {{ totalSeconds }} giây</vue-countdown
    >
    <span
      class="text-gold-200"
      v-else
      >Gửi lại OTP</span
    >
  </button>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { message } from 'ant-design-vue'

export default {
  props: {
    timing: {
      type: Number,
      default: 0
    }
  },
  emits: ['setTiming', 'resent'],
  setup(prop, { emit }) {
    const timingCount = ref(0)
    const counting = ref(false)
    const startCountdown = () => {
      const currentTime = new Date().getTime()
      const time = currentTime + 120000
      localStorage.setItem('timing_otp_login', JSON.stringify(time))
      emit('setTiming', 120000)
      counting.value = true
      emit('resent')
    }
    const onCountdownEnd = () => {
      counting.value = false
    }

    const initTiming = () => {
      const currentTime = new Date().getTime()
      const timeGetSession = JSON.parse(localStorage.getItem('timing_otp_login'))
      const remaining = timeGetSession - currentTime
      if (remaining > 0) {
        timingCount.value = remaining
      } else {
        timingCount.value = 0
      }
    }
    onMounted(() => {
      initTiming()
      counting.value = true
    })

    watch(
      () => prop.timing,
      () => {
        timingCount.value = prop.timing
      }
    )

    return { counting, timingCount, startCountdown, onCountdownEnd }
  }
}
</script>
