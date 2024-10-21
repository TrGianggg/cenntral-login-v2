<template>
  <div class="identify-mail flex flex-col gap-8">
    <p class="text-gold-150">{{ $t('recover.content_identify') }}</p>
    <a-form
      name="custom-validation"
      class="w-full"
      :model="states"
      layout="vertical"
      @finish="handleSubmit"
    >
      <a-form-item
        v-if="states.step === 'identify'"
        :label="$t('register.email')"
      >
        <a-input
          :placeholder="$t('register.email')"
          v-model:value.trim="states.email"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        v-else
        :label="$t('register.otp')"
        name="otp"
        :rules="[
          {
            required: true,
            trigger: 'change',
            message: $t('common.validate.code_otp_empty')
          }
        ]"
      >
        <a-input
          :placeholder="$t('register.otp')"
          v-model:value.trim="states.otp"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <div class="py-3">
        <Recaptcha
          v-if="states.step === 'identify'"
          :key="states.keyRecaptcha"
          @getRecaptcha="getKeyRecap"
        ></Recaptcha>
      </div>
      <a-form-item>
        <a-button
          :disabled="checkDisable || (states.recaptchaToken === '' && states.step === 'identify')"
          :type="checkDisable ? 'disable' : 'primary-shadow'"
          class="w-full mt-2"
          html-type="submit"
          >{{ $t('recover.title_button_identify_mail') }}</a-button
        >
      </a-form-item>
      <a-form-item>
        <p
          class="text-gold-150 cursor-pointer hover:underline text-center transition-500"
          @click="directLogin"
        >
          {{ $t('common.back') }}
        </p>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive } from 'vue'
import router from '@/router'
import { identifyEmailApi, confirmOtpRecoverApi } from '@/api/auth'
import { message } from 'ant-design-vue'
import Recaptcha from '@/components/app/Recaptcha.vue'

const states = reactive({
  email: '',
  step: 'identify',
  otp: '',
  timeConfirm: '',
  loading: false,
  keyRecaptcha: '',
  recaptchaToken: ''
})

const checkDisable = computed(() => {
  return !states.email.length
})

const identifyMail = async () => {
  states.loading = true
  const params = {
    email: states.email,
    time: new Date().getTime(),
    recaptcha: states.recaptchaToken
  }
  states.timeConfirm = params.time
  try {
    const { data } = await identifyEmailApi(params)
    if (data.sent) {
      states.step = 'confirmMail'
      states.otp = ''
      router.push({
        query: {
          code: btoa(JSON.stringify(params))
        }
      })
    }
  } catch (e) {
    message.error(e.message)
  } finally {
    states.loading = false
    randomKey()
  }
}

const confirmOtp = async () => {
  states.loading = true
  const params = {
    email: states.email,
    codeOtp: states.otp,
    recaptcha: states.recaptchaToken
  }
  try {
    const { data } = await confirmOtpRecoverApi(params)
    if (data) {
      data['time'] = states.timeConfirm
      const info = btoa(JSON.stringify(data))
      router.push({
        name: 'reset',
        query: {
          info: info
        }
      })
    }
  } catch (e) {
    message.error(e.message)
    console.log(e)
  } finally {
    states.loading = false
    randomKey()
  }
}

const parseData = () => {
  const { query } = router.currentRoute.value

  if (query && query.code) {
    try {
      const currentTime = new Date()
      const data = JSON.parse(atob(query.code))
      const timeConfirm = data.time + 120000
      if (timeConfirm >= currentTime.getTime()) {
        states.step = 'confirmMail'
        states.email = data.email
        states.timeConfirm = data.time
        return
      }
    } catch (e) {
      router.push({
        name: 'recover'
      })
    }
  }
  router.push({
    name: 'recover'
  })
}

const handleSubmit = async () => {
  if (states.step === 'identify') {
    await identifyMail()
  } else {
    await confirmOtp()
  }
}
const directLogin = () => {
  if (states.step === 'identify') {
    router.push({
      name: 'login'
    })
  } else {
    states.step = 'identify'
    router.push({
      name: 'identify'
    })
  }
}

const randomKey = () => {
  states.keyRecaptcha = Math.random()
  states.recaptchaToken = ''
}

const getKeyRecap = (value) => {
  states.recaptchaToken = value
}

onMounted(() => {
  parseData()
})
</script>
