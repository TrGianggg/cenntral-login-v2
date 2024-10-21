<template>
  <div class="get-mail-otp flex flex-col gap-8">
    <div
      v-if="step === 1"
      class="flex flex-col gap-4"
    >
      <p class="text-body-1 !font-bold !text-gold-150">{{ $t('register.set_2fa_title') }}</p>
      <p
        class="!text-neutral-600 text-body-4"
        v-html="$t('register.set_2fa_content')"
      ></p>
      <div class="border-solid border-2 relative border-gold-150 w-fit p-1">
        <img :src="formState.imageQr" />
      </div>
      <div
        class="min-h-[46px] rounded w-full px-4 border border-solid border-neutral-600 flex mb-4 items-center justify-between"
      >
        <p class="!text-white uppercase max-w-[80%] break-all">
          {{ formState.code2fa }}
        </p>
        <img
          src="@/assets/icons/icon_coppy_gold.svg"
          alt="icon_copy_gold"
          class="cursor-pointer"
          @click="handleCopy"
        />
      </div>
      <a-button
        class="w-full"
        type="primary-shadow"
        @click="handleNextStep"
        >{{ $t('common.continue') }}
      </a-button>
    </div>
    <a-form
      v-else
      ref="formRef"
      layout="vertical"
      name="custom-validation"
      class="w-full flex flex-col gap-8"
      :model="formState"
      :rules="rules"
      @finish="handleSubmit"
    >
      <a-form-item
        :label="$t('register.otp')"
        name="otp"
      >
        <a-input
          :placeholder="$t('register.otp')"
          v-model:value="formState.otp"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <div class="w-full flex justify-end">
        <p
          class="text-gold-150 cursor-pointer hover:underline transition-500"
          @click="() => (step = 1)"
        >
          {{ $t('common.back') }}
        </p>
      </div>
      <a-form-item>
        <a-button
          :loading="formState.loading"
          html-type="submit"
          class="w-full mt-4"
          :type="`primary-shadow`"
          >{{ $t('register.finish_register') }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { computed, onMounted, reactive, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { gen2fa, changeStatus2fa, loginApi } from '@/api/auth'
import { TYPE_SESSIONSTORAGE_AUTH } from '@/stores/auth'
import { setTokenAuth } from '@/helper/http/cookie'
import router from '@/router'
import { message } from 'ant-design-vue'

export default {
  name: 'Code2FA',
  setup() {
    const { t } = useI18n()
    const step = ref(1)
    const formState = reactive({
      otp: '',
      times: 0,
      code2fa: '',
      imageQr: '',
      loading: false
    })

    const rules = {
      otp: [
        {
          required: true,
          trigger: 'change',
          message: t('common.validate.code_empty')
        }
      ]
    }

    const dataRegister = computed(() => {
      return JSON.parse(sessionStorage.getItem(TYPE_SESSIONSTORAGE_AUTH.DATA_REGISTER_SUCCESS))
    })

    const login = async () => {
      try {
        formState.loading = true
        const params = {
          email: dataRegister.value?.email,
          password: dataRegister.value?.password
        }
        const { data } = await loginApi(params)
        if (data?.accessToken) {
          setTokenAuth(data.accessToken)
          await get2Fa()
        }
      } catch (e) {
        console.log(e)
      } finally {
        formState.loading = false
      }
    }

    const get2Fa = async () => {
      try {
        const { data } = await gen2fa()
        formState.code2fa = data.secret
        formState.imageQr = data.qr
      } catch (e) {
        console.log(e)
      }
    }

    const handleSubmit = async () => {
      try {
        formState.loading = true
        const params = {
          is2FaEnabled: true,
          otpToken: formState.otp
        }
        await changeStatus2fa(params)
        message.success(t('register.change_2fa_success'))
        router.push({
          name: 'register-kyc'
        })
      } catch (e) {
        message.error(e.message)
      } finally {
        formState.loading = false
      }
    }
    const handleNextStep = () => {
      step.value = 2
    }

    const handleCopy = () => {
      navigator.clipboard
        .writeText(formState.code2fa)
        .then(() => {
          message.success(t('register.copy_success'))
        })
        .catch((err) => {
          message.error(t('register.copy_fail') + err)
        })
    }

    onMounted(() => {
      if (dataRegister.value) {
        login()
      } else {
        router.push({
          name: 'login'
        })
      }
    })
    return { formState, rules, step, handleCopy, handleSubmit, handleNextStep }
  }
}
</script>
