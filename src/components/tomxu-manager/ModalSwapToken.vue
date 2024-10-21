<template>
  <div class="w-full">
    <a-button
      :type="amountPtomxu <= 0 ? 'disable' : 'gray'"
      class="w-full"
      style="height: 36px !important"
      :disabled="amountPtomxu <= 0"
      @click="() => (states.visible = !states.visible)"
    >
      <div class="flex flex-row items-center justify-center gap-2">
        <span>{{ $t('common.transfer') }} {{ LIST_TOKEN.p_tomxu }}</span>
        <SwapOutlined class="text-xl"></SwapOutlined>
      </div>
    </a-button>
    <a-modal
      centered
      wrapClassName="modal-transfer-tomxu"
      v-model:visible="states.visible"
    >
      <div class="flex flex-col justify-between mt-4 gap-4">
        <p class="text-gold-150 text-body-2 !font-bold">
          {{ $t('common.transfer') }}
        </p>
        <div class="flex flex-row items-center text-white gap-2">
          <span>Số dư hiện có: </span>
          <span class="break-all">{{ formatNumber(amountPtomxu) }}</span>
        </div>
        <a-form
          name="form-transfer-tomxu"
          class="w-full"
          :model="states"
          layout="vertical"
          @finish="handleSubmit"
          :rules="rules"
        >
          <a-form-item
            name="pTomxu"
            :rules="[
              {
                validator: validateAmount,
                trigger: 'change'
              }
            ]"
          >
            <a-input-number
              class="!w-full input-transfer"
              v-model:value="states.pTomxu"
              :placeholder="$t('tomxu.modal_transfer_tomxu.amount')"
            >
              <template #prefix>
                <p class="text-gold-150 mb-0 text-body-5">{{ LIST_TOKEN.p_tomxu }}</p>
              </template></a-input-number
            ></a-form-item
          >
          <div
            class="grid-cols-4 grid select-none gap-2 h-9 mb-3 border-neutral-600 rounded border-solid border-[1px] p-[4px]"
          >
            <div
              v-for="item in LIST_PERCENT"
              :class="[
                'w-full h-full flex rounded cursor-pointer',
                states.percentActive === item.value ? 'bg-gold-150' : 'bg-neutral-800'
              ]"
              @click="handleChangePercent(item.value)"
            >
              <span
                class="m-auto"
                :class="
                  states.percentActive === item.value ? 'text-neutral-950 font-bold' : 'text-white'
                "
                >{{ item.label }}</span
              >
            </div>
          </div>
          <div class="w-full flex mb-4">
            <div class="w-9 h-9 rounded-full flex m-auto arrow-box justify-center items-center">
              <ArrowDown />
            </div>
          </div>
          <a-form-item name="tomxu">
            <a-input-number
              class="!w-full input-transfer"
              v-model:value="states.tomXu"
              :placeholder="$t('tomxu.modal_transfer_tomxu.amount')"
            >
              <template #prefix>
                <p class="text-gold-150 mb-0 text-body-5">{{ LIST_TOKEN.tomxu }}</p>
              </template>
            </a-input-number></a-form-item
          >

          <a-form-item>
            <a-button
              html-type="submit"
              class="w-full"
              type="primary"
              >{{ $t('common.transfer') }}</a-button
            >
          </a-form-item>
        </a-form>
      </div>
      <a-modal
        centered
        wrapClassName="modal-transfer-tomxu"
        v-model:visible="states.openConfirm"
      >
        <div class="flex flex-col items-center justify-between gap-6 mt-16">
          <div class="flex flex-col gap-2 items-center text-body-1 text-neutral-400">
            <span>{{ $t('tomxu.confirm_swap') }}</span>
            <p class="text-neutral-400">
              <span class="text-gold-150">{{ states.pTomxu }} {{ LIST_TOKEN.p_tomxu }}</span>
            </p>
          </div>
          <div class="flex flex-col gap-4 w-full">
            <a-button
              :loading="states.loading"
              :disabled="states.loading"
              class="w-full"
              type="primary"
              @click="swapTọkenTomxu()"
              >{{ $t('common.confirm') }}</a-button
            >
          </div>
        </div>
      </a-modal>
    </a-modal>
  </div>
</template>
<script setup>
import { computed, watch, reactive, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatNumber } from '@/helper/ultil'
import { ArrowDownOutlined, SwapOutlined } from '@ant-design/icons-vue'
import { userStore } from '@/stores/userStore'
import { LIST_TOKEN } from '@/helper/const'
import { swapTomxuApi } from '@/api/tomxu'
import { message } from 'ant-design-vue'
import AppCustomVhtml from '@/components/app/AppCustomVhtml.vue'
import ArrowDown from '@/components/shared/icons/ArrowDown.vue'
const LIST_PERCENT = [
  {
    label: '25%',
    value: 0.25
  },
  {
    label: '50%',
    value: 0.5
  },
  {
    label: '75%',
    value: 0.75
  },
  {
    label: '100%',
    value: 1
  }
]
const { t } = useI18n()
const states = reactive({
  percentActive: 0,
  visible: false,
  openConfirm: false,
  pTomxu: 0,
  loading: false,
  tomXu: 0
})

const userInfo = computed(() => {
  return userStore().userInfo
})

const amountPtomxu = computed(() => {
  return Number(userInfo.value?.usersBalances?.[1]?.balance)
})

const validateAmount = async (_rule, value) => {
  if (value <= 0) {
    return Promise.reject(t('tomxu.modal_transfer_tomxu.min_amount'))
  } else {
    if (value > amountPtomxu.value) {
      return Promise.reject(t('tomxu.modal_transfer_tomxu.max_amount'))
    } else {
      return Promise.resolve()
    }
  }
}

watch(
  () => states.tomXu,
  (newValue) => {
    if (states.tomXu < 0) {
      states.tomXu = 0
    }
    states.pTomxu = newValue
  }
)

watch(
  () => states.pTomxu,
  (newValue) => {
    if (states.pTomxu < 0) {
      states.pTomxu = 0
      states.percentActive = 0
    }
    states.tomXu = newValue
    states.percentActive = states.pTomxu / amountPtomxu.value
  }
)

const handleChangePercent = (value) => {
  states.percentActive = value
  states.pTomxu = amountPtomxu.value * states.percentActive
}

const swapTọkenTomxu = async () => {
  states.loading = true
  const params = {
    pTomXu: states.pTomxu
  }
  try {
    await swapTomxuApi(params)
    states.openConfirm = false
    states.visible = false
    message.success('Bạn đã chuyển đổi thành công P sang CP')
  } catch (e) {
    // message.error(e.message)
    message.error({
      content: () => h(AppCustomVhtml, { content: e.message })
    })
    states.openConfirm = false
  } finally {
    states.loading = false
  }
}
const handleSubmit = async () => {
  states.openConfirm = true
}
</script>

<style lang="scss">
.arrow-box {
  background: var(--bg-box);
  color: var(--color-white);
  &:hover {
    background: var(--bg-box-hover);
  }
}
</style>
