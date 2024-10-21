<template>
  <div class="flex wrap_page_login padding-side-global">
    <div class="w-full max-w-[400px] mx-auto flex flex-col mt-20">
      <h1 class="text-heading-2 text-gradient mb-6">{{ $t('login.title') }}</h1>
      <a-form
        name="custom-validation"
        class="w-full"
        :model="states"
        layout="vertical"
        :rules="rules"
        @finish="handleSubmit"
      >
        <div v-if="states.step === 'login'">
          <a-form-item
            :label="$t('login.label_user_name')"
            name="email"
          >
            <a-input
              :placeholder="$t('login.label_user_name')"
              v-model:value.trim="states.email"
              class="!w-full"
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item
            :label="$t('register.password')"
            name="password"
          >
            <a-input-password
              type="password"
              :placeholder="$t('register.password')"
              v-model:value.trim="states.password"
              class="!w-full"
              autocomplete="off"
            />
          </a-form-item>
          <div class="flex flex-row justify-between">
            <p
              class="text-gold-150 cursor-pointer underline transition-500"
              @click="directRecoverPassword"
            >
              {{ $t('login.forgot_password') }}
            </p>
            <div class="flex flex-row items-center">
              <span class="mr-2 text-neutral-400">{{ $t('login.no_account') }}</span>
              <p
                class="text-gold-150 cursor-pointer underline transition-500"
                @click="directRegister"
              >
                {{ $t('register.title') }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-else-if="states.step === '2fa'"
          class="flex flex-col w-full items-end"
        >
          <a-form-item
            :label="$t('common.code_2fa')"
            name="code2fa"
            class="w-full"
          >
            <a-input
              :placeholder="$t('common.code_2fa')"
              v-model:value="states.code2fa"
              class="!w-full"
              autocomplete="off"
            />
          </a-form-item>
          <p
            class="text-gold-150 hover:underline cursor-pointer"
            @click="() => (states.step = 'login')"
          >
            {{ $t('common.back') }}
          </p>
        </div>
        <div
          v-else-if="states.step === 'verify-mail'"
          class="flex flex-col w-full items-end"
        >
          <p class="mb-2">{{ $t('register.title_step_2') }}</p>
          <a-form-item
            :label="`Xác nhận mã OTP`"
            name="otp"
            class="w-full"
          >
            <a-input
              :placeholder="`Mã OTP`"
              v-model:value="states.otp"
              class="!w-full"
              autocomplete="off"
            />
          </a-form-item>
          <div class="flex flex-row items-center justify-between w-full">
            <p
              class="text-gold-150 hover:underline cursor-pointer"
              @click="() => (states.step = 'login')"
            >
              {{ $t('common.back') }}
            </p>
            <ButtonCountDown
              @resent="resentOtp"
              @setTiming="setTiming"
              :timing="states.timingOtp"
            ></ButtonCountDown>
          </div>
        </div>
        <div class="mt-6 z-[900] relative">
          <Recaptcha
            v-if="states.step === 'login'"
            :key="keyRecaptcha"
            @getRecaptcha="getKeyRecap"
          ></Recaptcha>
        </div>
        <a-form-item>
          <!-- :disabled="checkDisable || (recaptchaToken === '' && states.step === 'login')" -->
          <a-button
            :loading="states.loading"
            html-type="submit"
            class="w-full mt-6"
            :type="checkDisable ? 'disable' : 'primary-shadow'"
            >{{ states.step === 'login' ? $t('common.login') : $t('common.continue') }}</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
import { computed, ref, onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { loginApi } from '@/api/auth'
import { message } from 'ant-design-vue'
import router from '@/router'
import { resendOtp } from '@/api/auth'
import { TYPE_SESSIONSTORAGE_AUTH } from '@/stores/auth'
import { setToken, setType, getType } from '@/helper/http/cookie'
import { userStore } from '@/stores/userStore'
import { ROOT_ROUTE } from '@/router'
import { supportStore, KEY_SUPPORT } from '@/stores/support'
import { updateClientIdApi } from '@/api/user'
import Recaptcha from '@/components/app/Recaptcha.vue'
import ButtonCountDown from '@/components/app/ButtonCountDown.vue'
import { setTimeRemainingOtp } from '@/helper'
import { confirmOtp } from '@/api/auth'
export default {
  name: 'PageLogin',
  components: {
    ButtonCountDown,
    Recaptcha
  },
  setup() {
    const { t } = useI18n()
    const recaptchaToken = ref('')
    const keyRecaptcha = ref('')
    const states = reactive({
      email: '',
      password: '',
      loading: false,
      code2fa: '',
      step: 'login',
      otp: '',
      timingOtp: 0
    })

    const rules = {
      code2fa: [
        {
          required: true,
          trigger: 'change',
          message: t('common.validate.code_2fa_empty')
        }
      ],
      otp: [
        {
          required: true,
          trigger: 'change',
          message: 'Mã OTP không được bỏ trống'
        }
      ]
    }
    const checkDisable = computed(() => {
      return states.email === '' || states.password === ''
    })

    const loginNormal = async () => {
      try {
        states.loading = true
        const params = {
          email: states.email,
          password: states.password,
          recaptcha: recaptchaToken.value,
          codeOtp: states.otp
        }
        const { data } = await loginApi(params)
        if (data === null) {
          localStorage.setItem('timing_otp_login', JSON.stringify(setTimeRemainingOtp(120000)))
          states.step = 'verify-mail'
        } else {
          if (data.auth2fa) {
            states.step = '2fa'
          } else if (data?.accessToken) {
            setToken(data.accessToken)
            await userStore().getUserInfo()
            updateFirebaseId()
            setType('first-time')
            router.push({ name: ROOT_ROUTE })
          }
        }
      } catch (e) {
        console.log(e)
        if (e.statusCode === 403 && !e.message.includes('bị khóa')) {
          try {
            sessionStorage.setItem(TYPE_SESSIONSTORAGE_AUTH.EMAIL_AUTH, states.email)
            sessionStorage.setItem(
              TYPE_SESSIONSTORAGE_AUTH.DATA_REGISTER_SUCCESS,
              JSON.stringify(states)
            )
            const time = new Date()
            resendOtp({ email: states.email, recaptcha: recaptchaToken.value })
            const timeData = {
              time: time.getTime(),
              times: 1
            }
            localStorage.setItem('time_out_otp_register', JSON.stringify(timeData))
            router.push({ name: 'validate-email' })
          } catch (e) {
            message.error(e.message)
            randomKey()
          }
        } else {
          if (e.message.includes('Bạn cần chờ ít nhất 120')) {
            localStorage.setItem('timing_otp_login', JSON.stringify(setTimeRemainingOtp(120000)))
            states.step = 'verify-mail'
            message.error(e.message)
            // resendOtp({ email: states.email, recaptcha: recaptchaToken.value })
          } else {
            if (e.message.includes('bị khóa')) {
              message.error('Tài khoản đã bị khóa')
            } else {
              if (e.message.includes('đang bị tạm khóa')) {
                message.error('Tài khoản đã bị hạn chế')
              } else {
                message.error(e.message)
              }
            }
          }
          randomKey()
        }
      } finally {
        states.loading = false
      }
    }

    const loginWith2Fa = async () => {
      states.loading = true
      const params = {
        email: states.email,
        password: states.password,
        code2Fa: states.code2fa,
        recaptcha: recaptchaToken.value
      }

      try {
        const { data } = await loginApi(params)
        if (data?.accessToken) {
          setToken(data.accessToken)
          await userStore().getUserInfo()
          updateFirebaseId()
          router.push({ name: ROOT_ROUTE })
        }
      } catch (e) {
        message.error(e.message)
      } finally {
        states.loading = false
      }
    }

    const verifyOtp = async () => {
      const params = {
        email: states.email,
        otp: states.otp
      }
      try {
        const res = await confirmOtp(params)
        if (res.data) {
          states.step = 'login'
          message.success('Đã xác minh thành công, đăng nhập ngay!')
        }
      } catch (e) {
        message.error(e.message)
      }
    }
    const handleSubmit = async () => {
      if (states.step === 'login') {
        await loginNormal()
      } else {
        if (states.step === 'verify-mail') {
          await verifyOtp()
        } else {
          await loginWith2Fa()
        }
      }
    }

    const updateFirebaseId = () => {
      const firebaseId = localStorage.getItem('clientId')
      if (firebaseId) {
        updateClientIdApi({
          firebaseId: firebaseId
        })
      }
    }

    const directRegister = () => {
      router.push({
        name: 'register'
      })
    }
    const directRecoverPassword = () => {
      supportStore().setKey(KEY_SUPPORT.CHANGEPASS)
      router.push({
        name: 'recover'
      })
    }

    const clearCacheSession = () => {
      sessionStorage.removeItem(TYPE_SESSIONSTORAGE_AUTH.EMAIL_AUTH)
      sessionStorage.removeItem(TYPE_SESSIONSTORAGE_AUTH.DATA_REGISTER_SUCCESS)
    }
    const setTiming = (value) => {
      states.timingOtp = value
    }
    onMounted(() => {
      clearCacheSession()
      localStorage.removeItem('clientId')
    })

    const getKeyRecap = (value) => {
      recaptchaToken.value = value
    }

    const randomKey = () => {
      keyRecaptcha.value = Math.random()
      recaptchaToken.value = ''
    }

    const resentOtp = async () => {
      try {
        await resendOtp({ email: states.email, recaptcha: recaptchaToken.value })
      } catch (e) {
        console.log(e)
      }
    }

    watch(
      () => states.step,
      () => {
        randomKey()
      }
    )

    return {
      states,
      setTiming,
      getKeyRecap,
      resentOtp,
      recaptchaToken,
      rules,
      checkDisable,
      directRecoverPassword,
      handleSubmit,
      directRegister,
      keyRecaptcha
    }
  }
}
</script>
