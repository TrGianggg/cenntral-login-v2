<template>
  <div class="w-full">
    <a-button
      type="gray"
      class="w-full"
      style="height: 36px !important"
      @click="showModal"
      :disabled="isPackageDefaultOrTrial"
    >
      <div class="flex flex-row w-full justify-center gap-2">
        <span class="text-neutral-800-1">{{ $t('tomxu.sent') }}</span>
        <img :src="ArrowGold" />
      </div>
    </a-button>
    <a-modal
      centered
      wrapClassName="modal-transfer-tomxu"
      v-model:visible="open"
    >
      <div class="w-full pt-6">
        <p class="text-gradient text-heading-3">
          {{ $t('tomxu.modal_transfer_tomxu.title_main') }}
        </p>
        <a-form
          name="form-transfer-tomxu"
          class="w-full"
          :model="states"
          layout="vertical"
          @finish="handleSubmit"
          :rules="rules"
        >
          <a-form-item
            :label="$t('tomxu.modal_transfer_tomxu.amount')"
            name="amount"
          >
            <a-input-number
              class="!w-full"
              v-model:value="states.amount"
              :placeholder="$t('tomxu.modal_transfer_tomxu.amount')"
            >
            </a-input-number
          ></a-form-item>
          <a-form-item
            :label="$t('tomxu.modal_transfer_tomxu.user_name')"
            name="address"
          >
            <a-input
              class="!w-full"
              v-model:value="states.address"
              :placeholder="$t('tomxu.modal_transfer_tomxu.user_name')"
            >
              <template #suffix>
                <DetectQR @getQrCode="getQrCode"></DetectQR>
              </template> </a-input
          ></a-form-item>
          <div class="flex flex-col gap-2 mb-6">
            <p class="mb-0 text-neutral-400">{{ $t('tomxu.modal_transfer_tomxu.message') }}</p>
            <a-textarea
              :rows="3"
              class="!py-2"
              v-model:value="states.message"
              :placeholder="$t('tomxu.modal_transfer_tomxu.message_placeholder')"
            ></a-textarea>
          </div>
          <a-form-item
            :label="$t('tomxu.modal_transfer_tomxu.otp')"
            name="otp"
          >
            <a-input
              class="!w-full"
              v-model:value="states.otp"
              :placeholder="$t('tomxu.modal_transfer_tomxu.otp')"
            >
              <template #suffix>
                <p
                  v-if="!states.counting"
                  class="text-gold-150 mb-0 cursor-pointer"
                  @click="setTokenOtp"
                >
                  {{ $t('common.sent_otp') }}
                </p>
                <vue-countdown
                  v-if="states.counting"
                  :time="states.timerOtp"
                  @end="onCountdownEnd"
                  @progress="runCountdownEnd"
                  v-slot="{ totalSeconds }"
                  ><span class="text-gold-150">
                    Gửi lại sau {{ totalSeconds }}s
                  </span></vue-countdown
                >
              </template>
            </a-input></a-form-item
          >
          <a-form-item
            v-if="userInfo.twoFaEnabled"
            :label="$t('tomxu.modal_transfer_tomxu.two_fa')"
            name="two_fa"
          >
            <a-input
              class="!w-full"
              v-model:value="states.tow_fa"
              :placeholder="$t('tomxu.modal_transfer_tomxu.two_fa')"
            >
            </a-input
          ></a-form-item>
          <p class="text-neutral-400 text-body-4 mb-4">
            {{ $t('tomxu.fee') }}: <span class="text-gold-150">{{ 0 }} {{ LIST_TOKEN.tomxu }}</span>
          </p>
          <a-form-item>
            <a-button
              :disabled="isPackageDefaultOrTrial"
              html-type="submit"
              class="w-full"
              type="primary"
              >{{ $t('common.sent') }}</a-button
            >
            <h1
              v-if="isPackageDefaultOrTrial"
              class="text-red-400"
            >
              Vui lòng mua gói để sử dụng tính năng chuyển CP
            </h1>
          </a-form-item>
        </a-form>
      </div>
      <a-modal
        centered
        wrapClassName="modal-transfer-tomxu"
        v-model:visible="openConfirm"
      >
        <div class="flex flex-col items-center justify-between gap-[76px] mt-16">
          <div class="flex flex-col gap-2 items-center text-body-1 text-neutral-400">
            <span>Xác nhận gửi</span>
            <span class="text-gold-150 text-heading-4 font-bold"
              >{{ states.amount }} {{ LIST_TOKEN.tomxu }}</span
            >
            <span>Tới địa chỉ ví</span>
            <span class="text-gold-150 text-heading-4 font-bold break-all text-center">{{
              states.address
            }}</span>
            <p class="text-neutral-400">
              {{ $t('tomxu.fee') }}:
              <span class="text-gold-150">{{ 0 }} {{ LIST_TOKEN.tomxu }}</span>
            </p>
          </div>
          <div class="flex flex-col gap-4 w-full">
            <a-button
              :loading="states.loading"
              :disabled="states.loading"
              html-type="submit"
              class="w-full"
              type="primary"
              @click="sentToken"
              >{{ $t('common.sent') }}</a-button
            >
          </div>
        </div>
      </a-modal>
    </a-modal>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue'
import { Form } from 'ant-design-vue'
import { userStore } from '@/stores/userStore'
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setTokenOtpApi, setTokenApi } from '@/api/tomxu'
import DetectQR from '@/components/tomxu-manager/DetectQR.vue'
import router from '@/router'
import { LIST_TOKEN } from '@/helper/const'
import ArrowGold from '@/assets/icons/tomxu/arrow-gold.svg'
const useForm = Form.useForm
const { t } = useI18n()
const states = reactive({
  amount: 0,
  address: '',
  message: '',
  otp: '',
  tow_fa: '',
  loading: false,
  counting: true,
  timerOtp: 0
})

const userInfo = computed(() => {
  return userStore().userInfo
})
const packageName = JSON.parse(localStorage.getItem('userInfo')).package.name
const isPackageDefaultOrTrial = packageName === 'Default' || packageName === 'Trial'
const open = ref(false)
const openConfirm = ref(false)

const validateAmount = async (_rule, value) => {
  if (value <= 0) {
    return Promise.reject(t('tomxu.modal_transfer_tomxu.min_amount'))
  } else {
    return Promise.resolve()
  }
}
const rules = reactive({
  amount: [
    {
      validator: validateAmount,
      trigger: 'change'
    }
  ],
  address: [
    {
      required: true,
      trigger: 'change',
      message: t('tomxu.modal_transfer_tomxu.user_name_empty')
    }
  ],
  message: [],
  otp: [
    {
      required: true,
      trigger: 'change',
      message: t('tomxu.modal_transfer_tomxu.otp_empty')
    }
  ],
  tow_fa: [
    {
      required: true,
      trigger: 'change',
      message: t('tomxu.modal_transfer_tomxu.two_fa_empty')
    }
  ]
})

const { resetFields, clearValidate } = useForm(states, rules)

const handleSubmit = async () => {
  openConfirm.value = true
}
const showModal = () => {
  if (userInfo.value.kycStatus === 'approved') {
    open.value = true
    resetFields()
  } else {
    router.push({
      name: 'kyc'
    })
  }
}

const setTokenOtp = async () => {
  try {
    const { data } = await setTokenOtpApi()
    if (data.sent) {
      message.success(t('register.message_register_success'))
      const currentTime = new Date().getTime() + 120000
      localStorage.setItem('otp_sent_token', currentTime)
      states.timerOtp = 120000
      states.counting = true
    }
  } catch (e) {
    message.error(e.message)
  }
}

const sentToken = async () => {
  states.loading = true
  const params = {
    value: Number(states.amount),
    email: states.address,
    codeOtp: states.otp,
    message: states.message,
    code2Fa: states.tow_fa
  }
  try {
    await setTokenApi(params)
    message.success(t('tomxu.modal_transfer_tomxu.sent_success', { email: states.address }))
    await userStore().getUserInfo()
    openConfirm.value = false
    open.value = false
  } catch (e) {
    message.error(e.message)
    openConfirm.value = false
  } finally {
    states.loading = false
  }
}

const getQrCode = (qr) => {
  states.address = qr
}

const onCountdownEnd = (value) => {
  states.counting = value
}

const runCountdownEnd = (value) => {}

watch(
  () => states.amount,
  () => {
    const maxAmount = userInfo.value?.usersBalances?.[0]?.balance
    if (states.amount > maxAmount) {
      states.amount = maxAmount
    }
  }
)
watch(
  () => open.value,
  () => {
    if (open.value) {
      const currentTime = new Date().getTime()
      const timerRemain = localStorage.getItem('otp_sent_token') || 0
      const rangeTime = timerRemain - currentTime
      if (Number(rangeTime) > 0) {
        states.timerOtp = Number(rangeTime)
        states.counting = true
      }
    }
  },
  { deep: true }
)
</script>
