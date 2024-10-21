<template>
  <div
    @click="
      () => {
        openModal = true
      }
    "
    class="select-item"
  >
    <IconEdit />
    <span>{{ $t('common.edit_info') }}</span>
  </div>
  <a-modal
    width="480px"
    class="modal-share-fund modal-change-info"
    :closable="false"
    v-model:visible="openModal"
  >
    <template #title>
      <div class="flex flex-row items-center gap-3">
        <IconEdit type="black"></IconEdit>
        <span>{{ $t('common.edit_info') }}</span>
      </div>
    </template>
    <div>
      <a-form
        :rules="rules"
        :model="form"
        layout="vertical"
        @finish="handleSubmit"
        class="flex flex-col gap-1"
      >
        <div class="flex flex-row items-center justify-between gap-3">
          <a-form-item
            :label="$t('register.firstName')"
            name="firstName"
            class="w-full"
          >
            <a-input
              :maxlength="99"
              v-model:value.trim="form.firstName"
              class="!w-full"
              :placeholder="$t('register.firstName')"
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item
            :label="$t('register.lastName')"
            name="lastName"
            class="w-full"
          >
            <a-input
              :maxlength="99"
              v-model:value.trim="form.lastName"
              class="!w-full"
              :placeholder="$t('register.lastName')"
              autocomplete="off"
            />
          </a-form-item>
        </div>
        <a-form-item
          :label="$t('register.sex')"
          name="gender"
        >
          <div class="w-full flex flex-row items-center gap-3">
            <div
              v-for="item in listGender"
              :key="item.value"
              :class="[
                'w-full border-solid border h-[48px] flex rounded cursor-pointer',
                form.gender === item.value
                  ? 'text-white item-sex-active border-primary-color'
                  : 'border-neutral-600 text-neutral-600'
              ]"
              @click="handleChangeSex(item.value)"
            >
              <span class="m-auto">{{ item.label }}</span>
            </div>
          </div>
        </a-form-item>
        <a-form-item
          class="!flex form-input-phone-number"
          :label="'Số điện thoại'"
          name="phone"
        >
          <a-form-item-rest>
            <a-select
              show-search
              v-model:value="form.codeCountry"
              :dropdownMatchSelectWidth="false"
              class="!w-[40%]"
              :options="countryCodeList"
            >
            </a-select>
          </a-form-item-rest>
          <a-input
            v-model:value.trim="form.phone"
            :placeholder="$t('register.phone')"
            class="!w-full"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item>
          <div class="flex flex-col gap-4 w-full">
            <a-button
              :disabled="checkChangeInfo"
              :loading="loading"
              class="w-full"
              type="primary"
              html-type="submit"
              >Lưu</a-button
            >
            <a-button
              class="w-full"
              @click="() => (openModal = false)"
              type="gray-light"
              >{{ $t('common.cancel') }}</a-button
            >
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import IconEdit from '@/components/shared/icons/IconEdit.vue'
import { useI18n } from 'vue-i18n'
import { countryCodeList } from '@/helper/const'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { userStore } from '@/stores/userStore'
import { updateInfoUser } from '@/api/user'
import { message } from 'ant-design-vue'
import { Form } from 'ant-design-vue'
const useForm = Form.useForm
const { t } = useI18n()
const loading = ref(false)
const openModal = ref(false)
const phoneValue = ref('')
let oldInfo = reactive({})
const form = reactive({
  firstName: '',
  lastName: '',
  gender: '',
  phone: '',
  codeCountry: ''
})

const userInfo = computed(() => {
  return userStore().userInfo
})

const handleChangeSex = (value) => {
  form.gender = value
}
const listGender = [
  {
    value: 'Male',
    label: t('register.male')
  },
  {
    value: 'Female',
    label: t('register.female')
  },
  {
    value: 'Other',
    label: t('register.other')
  }
]
const validateNumberPhone = async (_rule, value) => {
  if (value) {
    const parsedPhoneNumber = parsePhoneNumberFromString(value, renderCodeCountry.value)
    if (parsedPhoneNumber?.isValid()) {
      phoneValue.value = parsedPhoneNumber?.number
      return Promise.resolve()
    } else {
      return Promise.reject(t('common.validate.type_phone_number'))
    }
  } else {
    return Promise.reject(t('common.validate.empty_phone_number'))
  }
}

const renderCodeCountry = computed(() => {
  return countryCodeList.find((item) => item.value === form.codeCountry)?.code
})

const rules = {
  firstName: [
    {
      required: true,
      trigger: 'change',
      message: t('common.validate.name_user')
    }
  ],
  lastName: [
    {
      required: true,
      trigger: 'change',
      message: t('common.validate.name_user')
    }
  ],
  gender: [
    {
      required: true,
      trigger: 'change',
      message: t('common.validate.name_user')
    }
  ],
  phone: [
    {
      trigger: 'change',
      validator: validateNumberPhone
    }
  ]
}

const initUserInfo = () => {
  const countryCode = Number(userInfo.value.phoneCode?.replace('+', ''))
  const countryName = countryCodeList.find((item) => item.code_number === countryCode)?.value
  form.lastName = userInfo.value.lastName
  form.firstName = userInfo.value.firstName
  form.phone = userInfo.value.phone?.replace(userInfo.value?.phoneCode, '')
  form.codeCountry = countryName || 'Vietnam'
  form.gender = userInfo.value.gender
  oldInfo = { ...form }
}

const handleSubmit = async () => {
  loading.value = true
  const params = {
    firstName: form.firstName,
    lastName: form.lastName,
    gender: form.gender
  }
  if (phoneValue.value !== userInfo.value.phone) {
    params['phone'] = phoneValue.value
  }
  try {
    await updateInfoUser(params)
    message.success('Cập nhật thông tin cá nhân thành công')
    userStore().setRefresh(!userStore().refresh)
    await userStore().getUserInfo()
    openModal.value = false
  } catch (e) {
    console.log(e)
    message.error(e.message)
  } finally {
    loading.value = false
  }
}

const checkChangeInfo = computed(() => {
  return JSON.stringify(oldInfo) === JSON.stringify(form)
})

watch(
  () => openModal.value,
  () => {
    if (openModal.value) {
      initUserInfo()
    }
  }
)

watch(
  () => form.codeCountry,
  () => {}
)
</script>
<style lang="scss">
.modal-change-info {
  .ant-modal-header {
    border-bottom: unset;
    padding-bottom: 10px;
  }
}
</style>
