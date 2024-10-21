<template>
  <div
    class="page-set-2fa flex flex-col gap-8 w-full max-w-[400px] mt-12 lg:mt-24 padding-side-global"
  >
    <div
      v-if="states.step === 'gen2fa'"
      class="flex flex-col gap-4"
    >
      <p class="text-heading-3 title-2fa !font-bold">{{ $t('register.set_2fa_title') }}</p>
      <p
        class="text-body-4 title-2fa-setting"
        v-html="$t('register.set_2fa_content')"
      ></p>
      <div class="border-solid border-2 relative border-gold-150 w-fit p-1">
        <img :src="states.imageQr" />
      </div>
      <div
        class="min-h-[46px] rounded w-full px-4 border border-solid border-neutral-600 flex mb-4 items-center justify-between"
      >
        <p class="!text-white uppercase max-w-[80%] break-all">
          {{ states.code2fa }}
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
        @click="() => (states.step = 'set2fa')"
        >{{ $t('common.continue') }}
      </a-button>
    </div>
    <div v-else>
      <a-form
        ref="formRef"
        layout="vertical"
        name="custom-validation"
        class="!w-full flex flex-col gap-8"
        :model="states"
        :rules="rules"
        @finish="handleSubmit"
      >
        <a-form-item
          :label="$t('register.otp')"
          name="otp"
          class="!mb-0"
        >
          <a-input
            :placeholder="$t('register.otp')"
            v-model:value="states.otp"
            class="!w-full"
            autocomplete="off"
          />
        </a-form-item>
        <div
          v-if="userInfo.twoFaEnabled === null"
          class="w-full flex justify-end"
        >
          <p
            class="text-gold-150 cursor-pointer hover:underline transition-500"
            @click="states.step = 'gen2fa'"
          >
            {{ $t('common.back') }}
          </p>
        </div>
        <a-form-item>
          <a-button
            :loading="states.loading"
            html-type="submit"
            class="w-full"
            :type="`primary-shadow`"
            >{{ genTitle2Fa }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gen2fa, changeStatus2fa } from '@/api/auth'
import { message } from 'ant-design-vue'
import { userStore } from '@/stores/userStore'
import { useAppStore } from '@/stores/appStore'
import router from '@/router'

const userInfo = computed(() => userStore().userInfo)
const { t } = useI18n()
const states = reactive({
  otp: '',
  times: 0,
  step: 'gen2fa',
  code2fa: '',
  imageQr: '',
  loading: false
})

const genTitle2Fa = computed(() => {
  switch (userInfo.value.twoFaEnabled) {
    case null:
      return t('common.authenticator')
    case false:
      return t('common.turn_on_authenticator')
    default:
      return t('common.turn_off_authenticator')
  }
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
const get2Fa = async () => {
  try {
    const { data } = await gen2fa()
    states.code2fa = data.secret
    states.imageQr = data.qr
  } catch (e) {
    console.log(e)
  }
}

const handleSubmit = async () => {
  try {
    states.loading = true
    const params = {
      is2FaEnabled: !userInfo.value.twoFaEnabled,
      otpToken: states.otp
    }
    const res = await changeStatus2fa(params)
    message.success(res.message || t('register.change_2fa_success'))
    router.back()
  } catch (e) {
    message.error(e.message)
  } finally {
    states.loading = false
  }
}

const handleCopy = () => {
  navigator.clipboard
    .writeText(states.code2fa)
    .then(() => {
      message.success(t('register.copy_success'))
    })
    .catch((err) => {
      message.error(t('register.copy_fail') + err)
    })
}

const check2fa = () => {
  if (userInfo.value.twoFaEnabled === null) {
    get2Fa()
  } else {
    states.step = 'set2fa'
  }
}

watch(
  () => userInfo.value,
  () => {
    get2Fa()
  }
)

onMounted(() => {
  useAppStore().setDataBreadCrumb([
    {
      label: t('layout.menu_main.home'),
      link: '/'
    },
    {
      label: t('common.profile'),
      link: '/profile'
    },
    {
      label: t('register.set_2fa_title')
    }
  ])
  check2fa()
})
onUnmounted(() => {
  useAppStore().setDataBreadCrumb([])
})
</script>
<style lang="scss">
@import '@/design/variable.scss';
.page-set-2fa {
  .title-2fa {
    color: $neutral-400;
  }
  .title-2fa-setting {
    color: $neutral-400;
  }
}

.dark-theme {
  .page-set-2fa {
    .title-2fa {
      color: $gold-150;
    }
    .title-2fa-setting {
      span {
        color: $gold-150;
      }
    }
  }
}
</style>
