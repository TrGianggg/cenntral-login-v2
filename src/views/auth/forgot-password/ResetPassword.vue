<template>
  <div class="identify-mail flex flex-col gap-8">
    <p class="text-gold-150">{{ $t('recover.content_reset_password') }}</p>
    <a-form
      name="custom-validation"
      class="w-full"
      :model="states"
      layout="vertical"
      :rules="rules"
      @finish="handleSubmit"
    >
      <a-form-item
        :label="$t('register.password')"
        name="password"
      >
        <a-input-password
          v-model:value.trim="states.password"
          type="password"
          :placeholder="$t('register.password')"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        :label="$t('register.rePassword')"
        name="rePassword"
      >
        <a-input-password
          v-model:value.trim="states.rePassword"
          type="password"
          :placeholder="$t('register.rePassword')"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          :loading="states.loading"
          type="primary-shadow"
          class="w-full mt-2"
          html-type="submit"
          >{{ $t('recover.title_button_reset_password') }}</a-button
        >
      </a-form-item>
      <a-form-item>
        <p
          @click="backLogin"
          class="text-gold-150 cursor-pointer hover:underline hover:underline-offset-4 text-center transition-500"
        >
          {{ $t('common.back') }} {{ $t('common.login').toLowerCase() }}
        </p>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { REGEX_PASSWORD_SECURITY } from '@/helper/regex'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { resetPassword } from '@/api/auth'
import { message } from 'ant-design-vue'
import Recaptcha from '@/components/app/Recaptcha.vue'

const { t } = useI18n()
const states = reactive({
  email: '',
  codeOtp: '',
  password: '',
  rePassword: '',
  loading: false,
  keyRecaptcha: ''
})

const validateRePassword = async (_rule, value) => {
  if (value !== states.password) {
    return Promise.reject(t('common.validate.re_password'))
  } else if (value !== states.password) {
    return Promise.resolve()
  }
}

const rules = {
  password: [
    {
      required: true,
      trigger: 'change',
      message: t('common.validate.empty_password')
    },
    {
      pattern: REGEX_PASSWORD_SECURITY,
      trigger: 'change',
      message: t('common.validate.type_password')
    }
  ],
  rePassword: [
    {
      required: true,
      validator: validateRePassword,
      trigger: 'change'
    }
  ]
}

const parseData = () => {
  const { query } = router.currentRoute.value
  if (query && query.info) {
    console.log(JSON.parse(atob(query.info)))
    try {
      const currentTime = new Date()
      const data = JSON.parse(atob(query.info))
      const timeConfirm = data.time + 120000
      if (timeConfirm >= currentTime.getTime()) {
        states.email = data.email
        states.codeOtp = data.otp
        return
      }
    } catch (e) {
      router.push({
        name: 'login'
      })
    }
  }
  router.push({
    name: 'login'
  })
}

const handleSubmit = async () => {
  states.loading = true

  const params = {
    email: states.email,
    password: states.password,
    codeOtp: states.codeOtp
  }
  try {
    const { data } = await resetPassword(params)
    if (data.sent) {
      message.success(t('recover.reset_password_success'))
      router.push({
        name: 'login'
      })
    }
  } catch (e) {
    console.log(e)
    message.error(e.message)
  } finally {
    states.loading = false
  }
}
const backLogin = () => {
  router.push({
    name: 'login'
  })
}

onMounted(() => {
  parseData()
})
</script>
