<template>
  <div class="flex items-center flex-col mt-10">
    <div class="page-change-password w-full flex flex-col gap-6 max-w-[400px]">
      <div class="w-fill">
        <ButtonBack @click="router.back()"></ButtonBack>
      </div>
      <h1 class="text-heading-2 text-gradient">
        {{ $t('common.change_password') }}
      </h1>
      <a-form
        name="form-change-password"
        class="w-full"
        :model="states"
        layout="vertical"
        @finish="handleSubmit"
      >
        <div>
          <a-form-item
            name="password"
            :label="$t('common.password')"
            :rules="[
              {
                required: true,
                trigger: 'change',
                message: t('common.validate.empty_password')
              }
            ]"
          >
            <a-input-password
              v-model:value="states.password"
              :placeholder="$t('common.password')"
            >
            </a-input-password>
          </a-form-item>
          <a-form-item
            name="newPassword"
            :label="$t('common.new_password')"
            :rules="[
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
            ]"
          >
            <a-input-password
              v-model:value="states.newPassword"
              :placeholder="$t('common.new_password')"
            >
            </a-input-password>
          </a-form-item>
          <a-form-item
            :label="$t('common.renew_password')"
            name="reNewPassword"
            :rules="[
              {
                validator: validateRePassword,
                trigger: 'change'
              }
            ]"
          >
            <a-input-password
              :placeholder="$t('common.renew_password')"
              v-model:value="states.reNewPassword"
            >
            </a-input-password>
          </a-form-item>
          <a-form-item
            :label="$t('tomxu.modal_transfer_tomxu.otp')"
            name="otp"
            :rules="[
              {
                required: true,
                trigger: 'change',
                message: t('tomxu.modal_transfer_tomxu.otp_empty')
              }
            ]"
          >
            <a-input
              class="!w-full"
              v-model:value="states.otp"
              :placeholder="$t('tomxu.modal_transfer_tomxu.otp')"
            >
              <template #suffix>
                <p
                  class="text-gold-150 mb-0 cursor-pointer"
                  @click="sentOtp"
                >
                  {{ $t('common.sent_otp') }}
                </p>
              </template>
            </a-input></a-form-item
          >
          <div class="py-3">
            <Recaptcha
              :key="states.keyRecaptcha"
              @getRecaptcha="getKeyRecap"
            ></Recaptcha>
          </div>
          <a-form-item>
            <a-button
              :loading="states.loading"
              html-type="submit"
              class="w-full"
              type="primary"
              >{{ $t('common.change_password') }}</a-button
            >
          </a-form-item>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { REGEX_PASSWORD_SECURITY } from '@/helper/regex'
import ButtonBack from '@/components/app/ButtonBack.vue'
import router from '@/router'
import { sentOtpChangePassApi, changePassword } from '@/api/auth'
import Recaptcha from '@/components/app/Recaptcha.vue'

const { t } = useI18n()
const states = reactive({
  password: '',
  newPassword: '',
  reNewPassword: '',
  loading: false,
  keyRecaptcha: '',
  recaptchaToken: '',
  otp: ''
})

const validateRePassword = async (_rule, value) => {
  if (value !== states.newPassword) {
    return Promise.reject(t('common.validate.re_password'))
  } else if (value !== states.newPassword) {
    return Promise.resolve()
  }
}

const sentOtp = async () => {
  try {
    const { data } = await sentOtpChangePassApi()
    if (data) {
      message.success(t('register.message_register_success'))
    }
  } catch (e) {
    message.error(e.message)
  }
}

const handleSubmit = async () => {
  states.loading = true

  const params = {
    oldPassword: states.password,
    newPassword: states.newPassword,
    codeOtp: states.otp,
    recaptcha: states.recaptchaToken
  }
  try {
    await changePassword(params)
    message.success(t('common.change_password_success'))
    await router.push({
      name: 'feed'
    })
  } catch (e) {
    message.error(e.message)
  } finally {
    randomKey()
    states.loading = false
  }
}

const getKeyRecap = (value) => {
  states.recaptchaToken = value
}

const randomKey = () => {
  states.keyRecaptcha = Math.random()
  states.recaptchaToken = ''
}
</script>
