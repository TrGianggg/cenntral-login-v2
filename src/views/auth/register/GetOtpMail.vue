<template>
  <div class="get-mail-otp flex flex-col gap-8">
    <p class="!text-neutral-600 text-body-4">
      Vui lòng nhập mã OTP được hiển thị ở dưới đây để xác nhận
    </p>
    <div class="otp-number-container flex justify-center gap-2">
      <span
        v-for="(digit, index) in states.otpDigits"
        :key="index"
        class="otp-digit flex items-center justify-center border border-gray-300 rounded-md text-lg font-bold p-2"
      >
        {{ digit }}
      </span>
    </div>
    <a-form
      layout="vertical"
      name="custom-validation"
      :rules="rules"
      class="w-full flex flex-col gap-8"
      :model="formState"
      @finish="handleSubmit"
    >
      <a-form-item
        :label="$t('register.otp')"
        name="codeOtp"
      >
        <a-input
          v-model:value="formState.codeOtp"
          :placeholder="$t('register.otp')"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <div class="flex flex-row justify-center select-none">
        <span
          v-if="current_time <= MAX_TIMES"
          :class="[countdown > 0 ? '!text-neutral-600' : '!text-gold-150 cursor-pointer']"
          @click="handleResetOtp"
          >{{ $t('register.time_otp') }}
          <span>{{ countdown > 0 ? `( ${countdown}s )` : '' }}</span>
          <span v-if="countdown">{{
            current_time < MAX_TIMES ? `( ${current_time}/${MAX_TIMES} )` : ''
          }}</span></span
        >
        <span
          v-else
          class="text-[#F17E7E]"
          >{{ $t('register.limit_sent_otp', { limit: MAX_TIMES }) }}</span
        >
      </div>
      <a-form-item>
        <a-button
          html-type="submit"
          class="w-full"
          type="primary-shadow"
          >{{ $t('common.continue') }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { resendOtp } from '@/api/auth'
import { TYPE_SESSIONSTORAGE_AUTH } from '@/stores/auth'
import { message } from 'ant-design-vue'
import { confirmOtp } from '@/api/auth'
import router from '@/router'
import Recaptcha from '@/components/app/Recaptcha.vue'

const MAX_TIME = 120
const MAX_TIMES = 3
export default {
  name: 'EnterForm',
  components: { Recaptcha },
  setup(_, { emit }) {
    const { t } = useI18n()
    const countdown = ref(0)
    const current_time = ref(0)

    const formState = reactive({
      codeOtp: '',
      times: 0
    })

    const rules = {
      codeOtp: [
        {
          required: true,
          trigger: 'change',
          message: t('common.validate.code_empty')
        }
      ]
    }

    const otpNumber = ref(JSON.parse(localStorage.getItem('otp_number')))

    const otpDigits = computed(() => {
      return otpNumber.value.split('')
    })
    const states = reactive({
      otpDigits: otpNumber.value.split('')
    })

    const emailAuth = computed(() => {
      return JSON.parse(sessionStorage.getItem(TYPE_SESSIONSTORAGE_AUTH.DATA_REGISTER_SUCCESS))
    })

    const handleResentOtp = async () => {
      const email = emailAuth.value?.email
      if (!email) {
        message.error(t('common.handle_error.general_error'))
        return
      }
      try {
        await resendOtp({ email })
      } catch (e) {
        console.error(e)
        message.error(e.message)
      }
    }

    const startCountdown = () => {
      if (countdown.value > 0) {
        const timer = setInterval(() => {
          if (countdown.value > 0) {
            countdown.value--
          } else {
            clearInterval(timer)
          }
        }, 1000)
      }
    }

    const handleSubmit = async () => {
      const params = {
        otp: formState.codeOtp,
        email: emailAuth.value?.email
      }
      try {
        const { data } = await confirmOtp(params)
        if (data) {
          message.success('Đã đăng ký tài khoản thành công, bạn có thể đăng nhập ngay bây giờ!')
          router.push({
            name: 'login'
          })
        }
      } catch (err) {
        message.error(err.message)
      }
    }

    const handleSentOtp = async () => {
      try {
        const response = await resendOtp({ email: emailAuth.value?.email })
        if (response.data && response.data.sent) {
          states.otpDigits = response.data.sent.split('') // Update otpNumber with new OTP
          message.success('Đã gửi lại mã OTP')
        }
      } catch (e) {
        console.log(e)
      }
    }
    const setTimeoutOtp = () => {
      const currentTime = new Date().getTime()
      const timeOutData = JSON.parse(localStorage.getItem('time_out_otp_register'))
      if (timeOutData && timeOutData.time + MAX_TIME * 1000 > currentTime) {
        countdown.value = ((timeOutData.time + MAX_TIME * 1000 - currentTime) / 1000).toFixed()
        current_time.value = timeOutData?.times
      }
    }

    const handleResetOtp = () => {
      if (countdown.value < 1 && current_time.value <= MAX_TIMES) {
        handleSentOtp()
        countdown.value = MAX_TIME
        current_time.value = JSON.parse(localStorage.getItem('time_out_otp_register'))?.times + 1
        const timeData = {
          time: new Date().getTime(),
          times: current_time.value
        }
        localStorage.setItem('time_out_otp_register', JSON.stringify(timeData))
        startCountdown()
      }
    }

    onMounted(async () => {
      await setTimeoutOtp()
      await startCountdown()
      if (!emailAuth.value?.email) {
        router.push({
          name: 'login'
        })
      }
    })

    return {
      states,
      formState,
      rules,
      countdown,
      MAX_TIMES,
      current_time,
      startCountdown,
      handleSubmit,
      handleResentOtp,
      handleResetOtp,
      otpDigits
    }
  }
}
</script>
<style scoped>
.otp-digit {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #f9fafb; /* Light gray background */
  border: 2px solid #e2e8f0; /* Border color */
  border-radius: 8px; /* Rounded corners */
}
</style>
