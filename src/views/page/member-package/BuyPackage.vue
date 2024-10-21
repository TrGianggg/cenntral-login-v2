<template>
  <div
    v-if="!states.buySuccess"
    class="buy-package w-full flex flex-col gap-[38px] rounded-2xl lg:p-[34px] pb-12"
  >
    <div class="flex flex-row items-center gap-[14px]">
      <IconArrowLeft
        class="cursor-pointer"
        @click="emit('changeBuyPackage')"
      ></IconArrowLeft>
      <h1 class="text-gold-150 text-heading-3 text-xl md:text-[32px] text-start !mb-0">
        {{ 'Mua gói để sử dụng dịch vụ' }}
      </h1>
    </div>
    <div class="grid sm:grid-cols-2 grid-cols-1 gap-[24px]">
      <div
        v-for="premium in filteredPremiums"
        :key="premium.id"
        class="w-full package-container group flex"
      >
        <div
          class="w-full package-item bg-[#fffbed] rounded-[10px]"
          :class="isDark ? getStyle(premium).styleDark : getStyle(premium).styleLight"
        >
          <div class="w-full p-6">
            <div class="text-lg font-bold">{{ premium.description }}</div>
            <div class="text-2xl font-bold">
              {{
                formatPrice((premium.price + premium.price * states.vat - premium.discount) * 1000)
              }}

              <span class="text-base">/ {{ premium.validInDay }} ngày</span>
            </div>
            <button
              @click="confirmBuyPackage(premium)"
              :class="
                isDark ? getStyle(premium).buttonStyleDark : getStyle(premium).buttonStyleLight
              "
            >
              {{ premium.name === 'Business Extend' ? 'Gia Hạn' : 'Đăng ký' }}
            </button>
            <ul class="flex flex-col gap-3 text-body-2 mt-10">
              <li
                v-for="(item, index) in getDetails(premium.name)"
                :key="index"
                class="justify-between flex flex-row items-center gap-5"
              >
                <IconTick></IconTick>
                <p class="flex flex-row gap-[14px] items-center text-xs">
                  <span>{{ item }}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      centered
      wrapClassName="modal-transfer-tomxu modal-buy-package"
      v-model:visible="states.openConfirm"
    >
      <div class="flex flex-col items-center justify-between gap-6">
        <div class="flex flex-col gap-2 items-center">
          <p class="text-gold-150 text-heading-3">
            {{ $t('member_package.buy_package.confirm_payment') }}
          </p>
          <p class="text-body-1 text-white !font-semibold text-center">
            {{
              $t('member_package.buy_package.confirm_payment_content', {
                price: formatPrice(
                  (states.packageActive.price +
                    states.packageActive.price * states.vat -
                    states.packageActive.discount) *
                    1000
                ),

                name: states.packageActive.name
              })
            }}
          </p>
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
import { onMounted, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { userStore } from '@/stores/userStore'
import { getPackageApi } from '@/api/member-package'
import { buyPackageApi } from '@/api/member-package'
import { useThemeStore } from '@/stores/themeStore'
import IconTick from '@/components/shared/icons/sidebar/IconTick.vue'
import IconArrowLeft from '@/components/shared/icons/IconArrowLeft.vue'
import { LIST_TOKEN } from '@/helper/const'

// console.log('getPackage', masterDataStore().getPackageObject)

const emit = defineEmits(['changeBuyPackage'])
const { t } = useI18n()
const isDark = computed(() => useThemeStore().isDarkStore)

const states = reactive({
  openConfirm: false,
  loading: false,
  buySuccess: false,
  modalKyc: false,
  packageActive: {},
  fetchedPackages: [],
  vat: ''
})

const listPremiumNames = ['Consumer', 'Business', 'Business Extend']

const listPremiumStyles = {
  Consumer: {
    styleDark: 'bg-black border-gray-500 border-solid border-2 hover:bg-[#1E1E1E]',
    styleLight: 'bg-neutral-900 border-black border-solid border-2 hover:bg-[#F8F8F8]',
    buttonStyleLight:
      'w-full mt-4 p-2 font-semibold text-base bg-black text-neutral-900 border-black rounded-full',
    buttonStyleDark:
      'w-full mt-4 p-2 font-semibold text-base bg-white text-black border-black rounded-full',
    list_details: [
      'Combo 1 triệu - Sản phẩm hàng hóa',
      'Tặng voucher thăm khám sức khỏe theo phương pháp Đông Y hiện đại',
      'Được mua hàng trên sàn Thật. com với mức giảm giá 20%'
    ]
  },
  Business: {
    styleDark: 'bg-gold-300  text-white hover:bg-[#BE9417]',
    styleLight: ' bg-gold-300  text-neutral-900 hover:bg-gold-400',
    buttonStyleLight:
      'w-full mt-4 p-2 font-semibold text-base bg-neutral-900 text-black border-black rounded-full',
    buttonStyleDark:
      'w-full mt-4 p-2 font-semibold text-base bg-white text-black border-black rounded-full',
    list_details: [
      'Điểm danh hàng ngày có tiền',
      'Combo 1,6 triệu - Sản phẩm hàng hóa',
      'Tặng voucher thăm khám sức khỏe theo phương pháp Đông Y hiện đại',
      'Được mua hàng trên sàn Thật. com với mức giảm giá 25%',
      'Tặng 01 buổi trị liệu bằng phương pháp Đông Y hiệu quả',
      'Tặng 01 khóa Chuyển Giao Nghề ĐÔng Y miễn phí',
      'Tham gia 01 khóa học Livestream miễn phí',
      'Tham gia cây sinh lời, nhận thu nhập từ công ty'
    ]
  },
  'Business Extend': {
    styleDark: 'bg-gold-300  text-white hover:bg-[#BE9417]',
    styleLight: ' bg-gold-300  text-neutral-900 hover:bg-gold-400',
    buttonStyleLight:
      'w-full mt-4 p-2 font-semibold text-base bg-neutral-900 text-black border-black rounded-full',
    buttonStyleDark:
      'w-full mt-4 p-2 font-semibold text-base bg-white text-black border-black rounded-full',
    list_details: [
      'Được nhận Combo hàng từ 1.7 triệu đến 2.1 triệu',
      'Được mua hàng tại Đại lý, điểm bán Tomiru chiết khấu 10 -28% tất cả sản phẩm',
      'Được sở hữu vị trí cố định tại mô hình hoàn phí của Doanh nghiệp',
      'Cơ hội có nguồn thu nhập khi giới thiệu đủ 3 Khách hàng có nhu cầu kinh doanh.'
    ]
  }
}

const getPackageData = async () => {
  try {
    const response = await getPackageApi()

    states.fetchedPackages = response.data.packages

    states.vat = response.data.vat
  } catch (error) {
    console.error('Failed to fetch package data:', error)
  }
}

const filteredPremiums = computed(() => {
  return states.fetchedPackages.filter((pkg) => listPremiumNames.includes(pkg.name))
})

const getStyle = (premium) => listPremiumStyles[premium.name] || {}

const getDetails = (name) => listPremiumStyles[name]?.list_details || []

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

onMounted(() => {
  getPackageData()
})

const confirmBuyPackage = (value) => {
  states.packageActive = value
  states.openConfirm = true
  console.log(states.packageActive)
}

const directKyc = () => {
  router.push({
    name: 'kyc'
  })
}

const buyPackage = async () => {
  states.loading = true
  const params = {
    packageName: states.packageActive.name
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
</style>
