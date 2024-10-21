<template>
  <div class="register-page w-full flex flex-col gap-8">
    <a-form
      name="custom-validation"
      class="w-full"
      :model="formState"
      v-bind="layout"
      :rules="rules"
      @finish="handleSubmit"
    >
      <a-form-item
        :label="$t('register.email')"
        name="email"
      >
        <a-input
          :maxlength="99"
          v-model:value.trim="formState.email"
          class="!w-full"
          :placeholder="$t('register.email')"
          autocomplete="off"
        />
      </a-form-item>

      <div class="flex flex-row items-start gap-3">
        <a-form-item
          class="!w-full"
          :label="$t('register.firstName')"
          name="firstName"
        >
          <a-input
            v-model:value="formState.firstName"
            class="!w-full"
            :placeholder="$t('register.firstName')"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item
          class="!w-full"
          :label="$t('register.lastName')"
          name="lastName"
        >
          <a-input
            :maxlength="99"
            v-model:value="formState.lastName"
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
            v-for="item in listSex"
            :key="item.value"
            :class="[
              'w-full border-solid border h-[48px] flex rounded cursor-pointer',
              formState.gender === item.value
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
        class="w-full !flex form-input-phone-number"
        :label="$t('register.phone_placeholder')"
        name="phone"
      >
        <a-form-item-rest>
          <a-select
            show-search
            v-model:value="formState.codeCountry"
            class="!w-[40%]"
          >
            <a-select-option
              v-for="item in countryCodeList"
              :key="item.value"
              :value="item.value"
            >
              <div class="flex flex-row gap-1 items-center">
                <span :class="`fi fi-${item.code.toLowerCase()} min-w-[24px]`"></span>
                <p class="leading-[80%] !mb-0">{{ item.value }}(+{{ item.code_number }})</p>
              </div>
            </a-select-option>
          </a-select>
        </a-form-item-rest>
        <a-input
          v-model:value.trim="formState.phone"
          :placeholder="$t('register.phone')"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        :label="$t('register.userName')"
        name="userName"
      >
        <a-input
          v-model:value.trim="formState.userName"
          :placeholder="$t('register.userName')"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        :label="$t('register.password')"
        name="password"
      >
        <a-input-password
          v-model:value.trim="formState.password"
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
          v-model:value.trim="formState.rePassword"
          type="password"
          :placeholder="$t('register.rePassword')"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        :label="$t('register.ref')"
        name="ref"
      >
        <a-input
          v-model:value.trim="formState.ref"
          :placeholder="$t('register.ref')"
          class="!w-full"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        has-feedback
        name="isAccept"
      >
        <div class="flex flex-row items-center gap-2">
          <a-checkbox v-model:checked="formState.isAccept" />
          <span class="text-neutral-400 text-body-4"
            >{{ $t('register.accepted')
            }}<a
              href="https://tomiru.com/privacy-policy"
              target="_blank"
              class="text-gold-150 ml-1 underline cursor-pointer"
              >{{ $t('register.policy') }}</a
            ></span
          >
        </div>
      </a-form-item>
      <Recaptcha
        v-if="!formState.isRefValid"
        :key="states.keyRecaptcha"
        @getRecaptcha="getKeyRecap"
      ></Recaptcha>
      <a-form-item>
        <a-button
          html-type="submit"
          class="w-full mt-6"
          type="primary-shadow"
          >{{ $t('common.continue') }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>

  <a-modal
    centered
    wrapClassName="modal-transfer-tomxu modal-buy-package modal-confirm-register"
    v-model:visible="states.openConfirm"
  >
    <div class="flex flex-col items-center justify-between gap-6 mt-6">
      <div class="flex flex-col gap-2 items-center">
        <p class="text-heading-3 text-gold-150 text-center uppercase">
          {{ $t('register.title_check_rule') }}
        </p>
        <div class="flex flex-col w-full gap-4 mb-4">
          <a-checkbox
            class="check-box-28"
            v-model:checked="states.checkFirst"
          >
            <span class="text-body-3 text-white !font-bold">{{ $t('register.rule_1') }}</span>
          </a-checkbox>
          <a-checkbox
            class="check-box-28"
            v-model:checked="states.checkSecond"
          >
            <span class="text-body-3 text-white !font-bold">{{
              $t('register.rule_2')
            }}</span></a-checkbox
          >
          <a-checkbox
            class="check-box-28"
            v-model:checked="states.checkThird"
          >
            <span class="text-body-3 text-white !font-bold">{{
              $t('register.rule_3')
            }}</span></a-checkbox
          >
        </div>
      </div>
      <div class="flex flex-row gap-4 w-full">
        <a-button
          class="w-full"
          type="gray-light"
          @click="() => (states.openConfirm = false)"
          >{{ $t('common.cancel') }}</a-button
        >
        <a-button
          :disabled="!compCheckConfirmRules"
          :loading="formState.loading"
          class="w-full"
          type="primary"
          @click="setInfoRegister"
          >{{ $t('common.accept') }}</a-button
        >
      </div>
    </div>
  </a-modal>
</template>
<script>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { register } from '@/api/auth'
import { countryCodeList, LIST_TOKEN } from '@/helper/const'
import { REGEX_DATE_FORMAT, REGEX_PASSWORD_SECURITY, REGEX_EMAIL } from '@/helper/regex'
import { message } from 'ant-design-vue'
import router from '@/router'
import { TYPE_SESSIONSTORAGE_AUTH } from '@/stores/auth'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import Recaptcha from '@/components/app/Recaptcha.vue'
import PageNotFound from '@/views/Page-not-found/index.vue'

export default {
  name: 'EnterForm',
  components: { Recaptcha, PageNotFound },
  computed: {
    LIST_TOKEN() {
      return LIST_TOKEN
    }
  },

  setup() {
    const { t } = useI18n()
    const states = reactive({
      keyRecapcha: '',
      openConfirm: false,
      checkFirst: false,
      checkSecond: false,
      checkThird: false,
      recaptchaToken: '',
      validParams: false
    })
    const formRef = ref()
    const phoneValue = ref('')
    const formState = reactive({
      email: '',
      firstName: '',
      lastName: '',
      gender: 'Male',
      phone: '',
      address: '',
      dateOfBirth: '',
      userName: '',
      password: '',
      rePassword: '',
      ref: '',
      isAccept: false,
      loading: false,
      codeCountry: 'Vietnam',
      isRefValid: false
    })

    const reference = router.currentRoute.value.query.ref
    const type = router.currentRoute.value.query.type

    const showContent = computed(() => {
      return reference && type === 'from-social-web'
    })

    const compCheckConfirmRules = computed(() => {
      return states.checkSecond && states.checkThird && states.checkFirst
    })

    const renderCodeCountry = computed(() => {
      return countryCodeList.find((item) => item.value === formState.codeCountry)?.code
    })

    const validateRePassword = async (_rule, value) => {
      if (value !== formState.password) {
        return Promise.reject(t('common.validate.re_password'))
      } else if (value !== formState.password) {
        return Promise.resolve()
      }
    }
    const validateIsAccept = async (_rule, value) => {
      if (value) {
        return Promise.resolve()
      } else {
        return Promise.reject(t('register.is_accept_policy'))
      }
    }

    const validateNumberPhone = async (_rule, value) => {
      const parsedPhoneNumber = parsePhoneNumberFromString(value, renderCodeCountry.value)
      if (parsedPhoneNumber?.isValid()) {
        phoneValue.value = parsedPhoneNumber?.number
        return Promise.resolve()
      } else {
        return Promise.reject(t('common.validate.type_phone_number'))
      }
    }

    const listSex = [
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
    const rules = {
      email: [
        {
          required: true,
          trigger: 'change',
          message: t('common.validate.empty_email')
        },
        {
          pattern: REGEX_EMAIL,
          trigger: 'change',
          message: 'Hãy sử dụng email với tên miền khác!'
        },
        {
          type: 'email',
          trigger: 'change',
          message: t('common.validate.type_email')
        }
      ],
      isAccept: [
        {
          validator: validateIsAccept
        }
      ],
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
      ],
      address: [
        {
          required: true,
          trigger: 'change',
          message: t('common.validate.empty_address')
        }
      ],
      dateOfBirth: [
        {
          required: true,
          trigger: 'change',
          message: t('common.validate.empty_date')
        },
        {
          pattern: REGEX_DATE_FORMAT,
          trigger: 'change',
          message: t('common.validate.type_date')
        }
      ],
      userName: [
        {
          required: true,
          trigger: 'change',
          message: t('common.validate.user_empty')
        }
      ],
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
      ],
      ref: [
        {
          required: true,
          trigger: 'change',
          message: t('common.validate.ref_empty')
        }
      ]
    }
    const layout = {
      layout: 'vertical'
    }

    const setInfoRegister = async () => {
      formState.loading = true
      const params = {
        firstName: formState.firstName,
        lastName: formState.lastName,
        gender: formState.gender,
        password: formState.password,
        email: formState.email,
        username: formState.userName,
        phone: phoneValue.value,
        refCode: formState.ref,
        recaptcha: states.recaptchaToken
      }

      try {
        const { data, meta } = await register(params)
        if (data) {
          const { email } = formState
          sessionStorage.setItem(TYPE_SESSIONSTORAGE_AUTH.EMAIL_AUTH, email)
          sessionStorage.setItem(
            TYPE_SESSIONSTORAGE_AUTH.DATA_REGISTER_SUCCESS,
            JSON.stringify(params)
          )
          message.success(t('register.message_register_success'))
          const time = new Date()
          const timeData = {
            time: time.getTime(),
            times: 1
          }
          localStorage.setItem('time_out_otp_register', JSON.stringify(timeData))
          localStorage.setItem('otp_number', JSON.stringify(meta?.otp))
          router.push({ name: 'validate-email' })
        }
        randomKey()
      } catch (err) {
        message.error(err.message)
        randomKey()
      } finally {
        formState.loading = false
        states.openConfirm = false
        states.checkFirst = false
        states.checkSecond = false
        states.checkThird = false
      }
    }
    const handleSubmit = async () => {
      if (formState.email.includes('@yopmail.com')) {
        message.error('Hãy sử dụng email với tên miền khác!')
      } else {
        states.openConfirm = true
      }
    }

    const handleChangeSex = (value) => {
      formState.gender = value
    }

    const checkParamsValid = () => {
      const ref = router.currentRoute.value.query.ref

      if (ref) {
        formState.ref = ref
      }
    }

    watch(
      () => states.openConfirm,
      () => {
        ;(states.checkThird = false), (states.checkFirst = false), (states.checkSecond = false)
      }
    )

    const getKeyRecap = (value) => {
      states.recaptchaToken = value
    }

    const randomKey = () => {
      states.keyRecaptcha = Math.random()
      states.recaptchaToken = ''
    }

    onMounted(() => {
      checkParamsValid()
    })
    return {
      states,
      formState,
      formRef,
      listSex,
      layout,
      rules,
      compCheckConfirmRules,
      setInfoRegister,
      handleSubmit,
      handleChangeSex,
      getKeyRecap,
      countryCodeList,
      showContent
    }
  }
}
</script>

<style lang="scss">
@import '@/design/variable.scss';
.dark-theme {
  .item-sex-active {
    @apply bg-primary-color;
  }
}
.light-theme {
  .item-sex-active {
    background: white;
    border: 1px solid var(--primary-01);
    color: var(--primary-01);
  }
  .modal-confirm-register {
    .ant-modal-body {
      background: $neutral-850-2 !important;
    }
  }
}
</style>
