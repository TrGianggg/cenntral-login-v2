<!-- <template>
  <div
    v-if="!states.buySuccess"
    class="buy-package w-full flex flex-col gap-[38px] rounded-2xl lg:p-[34px] pb-12"
  >
    <div class="flex flex-row items-center gap-[14px]">
      <IconArrowLeft
        class="cursor-pointer"
        @click="() => emit('changeBuyPackage')"
      ></IconArrowLeft>
      <h1 class="text-gold-150 text-heading-3 text-xl md:text-[32px] text-start !mb-0">
        {{ 'Mua gói để sử dụng dịch vụ' }}
      </h1>
    </div>
    <div class="grid sm:grid-cols-2 grid-cols-1 gap-x-[24px] xl:gap-x-[64px]">
      <div
        v-for="premium in listPremium"
        :key="premium.key"
        class="w-full package-container group flex justify-center"
      >
        <div
          class="w-full package-item mx-auto max-w-[258px] relative aspect-[258/414] bg-[#fffbed] rounded-[40px]"
          :style="`background: ${isDark ? premium.colorBackGround : premium.colorBackGroundLight}`"
        >
          <img
            class="w-full absolute h-full"
            :src="premium.background"
            alt=""
          />
          <div class="w-full p-6 pt-[50%]">
            <ul class="flex flex-col gap-3 text-body-2">
              <li
                v-for="(item, index) in premium.list_details"
                class="justify-between flex flex-row items-center"
              >
                <p class="flex flex-row gap-[14px] items-center">
                  <span class="font-semibold text-body-1">{{ index + 1 }}</span>
                  <span>{{ item }}</span>
                </p>
                <IconTick></IconTick>
              </li>
            </ul>

            <div class="w-full relative flex items-center justify-center mt-[25px] hover:scale-110">
              <img
                class="h-[38px]"
                :src="isDark ? premium.backgroundButton : premium.backgroundButtonLight"
              />
              <div class="absolute flex items-center justify-center w-full">
                <span
                  @click="confirmBuyPackage(premium.key)"
                  class="text-[#000] font-bold text-body-4 cursor-pointer text-center w-[70%]"
                  :class="premium.key === 'Premium Gold' ? 'mb-[3px]' : ''"
                  >Mua ngay</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      centered
      wrapClassName=" modal-transfer-tomxu modal-buy-package"
      v-model:visible="states.openConfirm"
    >
      <h1 class="text-[32px] font-semibold text-center my-[47px]">
        Hãy lựa chọn gói <span style="color: rgb(202, 138, 4) !important">Prenium Gold</span> phù
        hợp với bạn
      </h1>
      <div class="flex flex-col items-center justify-between gap-6 mb-10">
        <!-- <div class="flex flex-col gap-2 items-center">
          <p class="text-gold-150 text-heading-3">
            {{ $t('member_package.buy_package.confirm_payment') }}
          </p>
          <p class="text-body-1 text-white !font-semibold text-center">
            {{
              $t('member_package.buy_package.confirm_payment_content', {
                price: getPackage[states.packageActive].price * 1.1,
                token: LIST_TOKEN.tomxu,
                name: getPackage[states.packageActive].name
              })
            }}
          </p>
        </div> -->
        <div
          v-for="(duration, index) in listDuration"
          :key="index"
          class="p-5 flex items-center justify-start gap-5 border-solid border-gray-400 border-2 w-full rounded-lg shadow"
          :class="states.isSelected[index] ? `border-yellow-600` : ``"
          @click="toggleSelected(index)"
        >
          <div
            v-if="states.isSelected[index]"
            class="w-[20px] h-[20px] rounded-full border-2 border-solid border-yellow-600 flex"
          >
            <div class="w-[10px] h-[10px] rounded-full bg-yellow-600 m-auto"></div>
          </div>
          <div
            v-else
            class="w-[20px] h-[20px] rounded-full border-2 border-solid border-black flex"
          >
            <!-- <div class="w-[10px] h-[10px] rounded-full bg-black m-auto"></div> -->
          </div>

          <div>
            <h1 class="text-[18px] font-semibold">{{ duration.title }}</h1>
            <p class="text-[14px] text-yellow-600">{{ duration.promotion }}</p>
            <p class="text-[14px] text-blue-600 font-semibold">{{ duration.price }}</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col ssm:flex-row gap-4 w-full">
        <a-button
          class="w-full"
          type="only-border"
          @click="() => (states.openConfirm = false)"
          >{{ $t('common.cancel') }}</a-button
        >
        <a-button
          :loading="states.loading"
          class="w-full"
          type="primary"
          @click="buyPackage"
          >{{ $t('common.confirm') }}</a-button
        >
      </div>
    </a-modal>

    <a-modal
      centered
      wrapClassName="modal-transfer-tomxu modal-required-kyc"
      v-model:visible="states.modalKyc"
    >
      <div class="flex flex-col items-center justify-between gap-6 mt-6">
        <div class="flex flex-col gap-2 items-center">
          <p class="text-body-1 text-white !font-semibold text-center">
            {{ $t('member_package.buy_package.required_kyc') }}
          </p>
        </div>
        <div class="flex flex-row gap-4 w-full">
          <a-button
            class="w-full"
            type="only-border"
            @click="states.modalKyc = false"
            >{{ $t('common.cancel') }}</a-button
          >
          <a-button
            :loading="states.loading"
            class="w-full"
            type="primary"
            @click="directKyc"
            >{{ $t('member_package.buy_package.kyc_button') }}</a-button
          >
        </div>
      </div>
    </a-modal>
  </div>
  <div
    v-else
    class="w-full bg-neutral-850 border flex flex-col gap-8 items-center border-neutral-600 border-solid rounded-2xl p-4 lg:p-[44px]"
  >
    <h1 class="text-gold-150 text-heading-3 !mb-0">{{ $t('common.success') }}</h1>
    <p
      class="text-body-1 text-white !font-semibold text-center"
      v-html="$t('member_package.buy_package.success_subtitle')"
    ></p>
    <a-button
      class="w-[200px]"
      type="primary"
      @click="finishBuyPackage"
      >OK</a-button
    >
  </div>
</template>
<script setup>
import { LIST_TOKEN } from '@/helper/const'
import { useI18n } from 'vue-i18n'
import { computed, reactive, defineProps, defineEmits } from 'vue'
import { userStore } from '@/stores/userStore'
import router from '@/router'
import { message } from 'ant-design-vue'
import { buyPackageApi } from '@/api/member-package'
// import BackgroundPremiumGold from '@/assets/images/member-package/premium_1.svg'
import BackgroundPremiumGold from '@/assets/images/member-package/bg_gold.svg'
// import BackgroundPremiumSliver from '@/assets/images/member-package/premium_2.svg'
import BackgroundPremiumSliver from '@/assets/images/member-package/bg_silver.svg'
import BackgroundPremiumBronze from '@/assets/images/member-package/bg_bronze.svg'

import BackgroundGold from '@/assets/images/member-package/button_premium_1.svg'
import BackgroundSliver from '@/assets/images/member-package/button_premium_2.svg'
// import BackgroundGoldLight from '@/assets/images/member-package/button_premium_1_light.svg'
import BackgroundGoldLight from '@/assets/images/member-package/button_gold_light.svg'
// import BackgroundSliverLight from '@/assets/images/member-package/button_premium_2_light.svg'
import BackgroundSliverLight from '@/assets/images/member-package/button_silver_light.svg'
import BackgroundBronzeLight from '@/assets/images/member-package/button_bronze_light.svg'
import IconTick from '@/components/shared/icons/sidebar/IconTick.vue'
import { useThemeStore } from '@/stores/themeStore'
import IconArrowLeft from '@/components/shared/icons/IconArrowLeft.vue'
import { masterDataStore } from '@/stores/masterDataStore'
const emit = defineEmits(['changeBuyPackage'])

const getPackage = computed(() => {
  return masterDataStore().getPackageObject
})
const isDark = computed(() => {
  return useThemeStore().isDarkStore
})
const states = reactive({
  pricePackage: 1320,
  openConfirm: false,
  loading: false,
  buySuccess: false,
  modalKyc: false,
  packageActive: '',
  isSelected: [true]
})

const props = defineProps({
  dataPackage: {
    type: Array,
    default: []
  }
})

const packagePremium = computed(() => {
  return props.dataPackage.find((item) => item.name === 'Premium')
})

const userInfo = computed(() => {
  return userStore().userInfo
})
const { t } = useI18n()

const listPremium = [
  {
    background: BackgroundPremiumGold,
    backgroundButton: BackgroundGold,
    backgroundButtonLight: BackgroundGoldLight,
    colorBackGround: '#0F0F0F',
    colorBackGroundLight: 'transparent',
    list_details: [
      'Chia sẻ thu nhập',
      'Dịch vụ Tom GPT',
      'Dịch vụ Tom Avatar',
      'Dịch vụ Tom Art',
      'Gian hàng riêng'
    ],
    key: 'Premium Gold'
  },
  {
    background: BackgroundPremiumSliver,
    backgroundButton: BackgroundSliver,
    backgroundButtonLight: BackgroundSliverLight,
    colorBackGround: '#0F0F0F',
    colorBackGroundLight: 'transparent',
    list_details: [
      'Chia sẻ thu nhập',
      'Dịch vụ Tom GPT',
      'Dịch vụ Tom Avatar',
      'Dịch vụ Tom Art',
      'Gian hàng riêng'
    ],
    key: 'Premium Sliver'
  },
  {
    background: BackgroundPremiumBronze,
    backgroundButton: BackgroundSliver,
    backgroundButtonLight: BackgroundBronzeLight,
    colorBackGround: '#0F0F0F',
    colorBackGroundLight: 'transparent',
    list_details: [
      'Chia sẻ thu nhập',
      'Dịch vụ Tom GPT',
      'Dịch vụ Tom Avatar',
      'Dịch vụ Tom Art',
      'Gian hàng riêng'
    ],
    key: 'Premium Bronze'
  }
]

const listDuration = [
  {
    title: 'Gói 12 tháng',
    promotion: 'Khuyến mãi thêm 2 tháng',
    price: 'Giá chỉ: xxxx CP',
    isSelected: false
  },
  {
    title: 'Gói 6 tháng',
    promotion: 'Khuyến mãi thêm 1 tháng',
    price: 'Giá chỉ: xxxx CP',
    isSelected: false
  },
  { title: 'Gói 1 tháng', promotion: '', price: 'Giá chỉ: xxxx CP', isSelected: false }
]

const toggleSelected = (index) => {
  states.isSelected[index] = !states.isSelected[index]
  for (let i = 0; i < states.isSelected.length; i++) {
    if (i !== index) {
      states.isSelected[i] = false
    }
  }
}

const confirmBuyPackage = (value) => {
  states.packageActive = value

  states.openConfirm = true
}

const directKyc = () => {
  router.push({
    name: 'kyc'
  })
}

const buyPackage = async () => {
  states.loading = true
  const params = {
    packageName: states.packageActive
  }
  try {
    await buyPackageApi(params)
    states.buySuccess = true
  } catch (e) {
    message.error(e.message)
  } finally {
    states.loading = false
    states.openConfirm = false
  }
}

const finishBuyPackage = () => {
  userStore().getUserInfo()
  emit('changeBuyPackage')
}
</script>
<style lang="scss">
.buy-package {
  .tag-price-option {
    background: #f0c428;
  }
}

.dark-theme {
  .tag-price-option {
    background: rgba(240, 196, 40, 0.1);
    color: #f0c428;
  }
}

.light-theme {
  .package-container {
    .package-item {
      &:hover {
        background: #fffbed;
      }
    }
  }
}
</style> -->
