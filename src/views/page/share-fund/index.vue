<template>
  <div class="share-fund-page">
    <TomixuCard> </TomixuCard>
    <div class="share-fund-page__header flex flex-row items-center gap-3">
      <p class="text-heading-3">Quỹ đồng chia</p>
      <IconHelp
        class="cursor-pointer xl:mt-2 mt-1 w-8 h-8"
        @click="() => (openModal = true)"
      ></IconHelp>
    </div>
    <div class="share-fund-page__body">
      <div class="item-share-container">
        <template
          v-for="item in dataShareFund"
          :key="item.name"
        >
          <CartShareFund :data="item"></CartShareFund>
        </template>
      </div>
    </div>
    <a-modal
      width="600px"
      class="modal-share-fund"
      v-model:visible="openModal"
    >
      <template #title>
        <div class="flex flex-row items-center gap-3">
          <IconShareFunActive></IconShareFunActive>
          <span class="font-bold text-body-1">Quỹ đồng chia</span>
        </div>
      </template>
      <div>
        <span class="font-bold text-body-3 !leading-[150%]"
          >Là nơi chứa toàn bộ các khoản thu nhập phát sinh mà khách hàng không đủ điều kiện nhận
          dưới dạng CP.</span
        ><br /><br />
        <ul class="list-disc px-6 text-body-3 gap-1 flex flex-col !leading-[150%]">
          <li class="!leading-[150%]">
            Khách hàng không gia hạn gói Premium (hết hạn gói nhưng không gia hạn)
            <span>&#10140;</span> 100% thu nhập phát sinh của khách hàng được chuyển về Quỹ đồng
            chia.
          </li>
          <li class="!leading-[150%]">
            Khách hàng mua gói Premium lần đầu tiên nhưng chưa giới thiệu đủ 3 khách hàng mua gói
            Thành viên <span>&#10140;</span> 100% thu nhập phát sinh của khách hàng được chuyển về
            Quỹ đồng chia.
          </li>
          <li class="!leading-[150%]">
            Khách hàng mua gói Premium từ lần thứ 2 nhưng chưa giới thiệu được bất kì khách hàng nào
            mua gói Thành viên <span>&#10140;</span> 30% thu nhập phát sinh của khách hàng được
            chuyển về Quỹ đồng chia (70% thu nhập còn lại khách hàng vẫn hưởng dưới dạng P).
          </li>
        </ul>
        <br />
        <span class="font-bold text-body-3 !leading-[135%]"
          >Được chia đều cho toàn bộ các thành viên đủ điều kiện hưởng theo 04 Quỹ đồng chia (Quỹ
          1-10%, Quỹ 2-20%, Quỹ 3-30%, Quỹ 4-40%) vào ngày đầu tiên của tháng mới.</span
        >
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import CartShareFund from '@/views/page/share-fund/CartShareFund.vue'
import { getShareFund } from '@/api/master-data'
import { onMounted, ref } from 'vue'
import IconHelp from '@/components/shared/icons/IconHelp.vue'
import IconShareFunActive from '@/components/shared/icons/sidebar/IconShareFunActive.vue'
import TomixuCard from '@/components/feed/TomixuCard.vue'
const DETAILS_SHARE_FUND = [
  [
    'Là Quỹ con chiếm 10% tổng số CP của Quỹ đồng chia.',
    'Chia  đều cho các khách hàng đang còn thời hạn trong gói Premium và giới thiệu được 01 khách hàng khác mua gói Premium TRỞ LÊN tính từ thời điểm mua gói của khách hàng tới thời điểm chia Quỹ.'
  ],
  [
    'Là Quỹ con chiếm 20% tổng số CP của Quỹ đồng chia.',
    'Chia  đều cho các khách hàng đang còn thời hạn trong gói Premium và giới thiệu được 02 khách hàng khác mua gói Premium TRỞ LÊN tính từ thời điểm mua gói của khách hàng tới thời điểm chia Quỹ.'
  ],
  [
    'Là Quỹ con chiếm 30% tổng số CP của Quỹ đồng chia.',
    'Chia  đều cho các khách hàng đang còn thời hạn trong gói Premium và giới thiệu được 03 khách hàng khác mua gói Premium TRỞ LÊN tính từ thời điểm mua gói của khách hàng tới thời điểm chia Quỹ.'
  ],
  [
    'Là Quỹ con chiếm 40% tổng số CP của Quỹ đồng chia.',
    'Chia  đều cho các khách hàng đang còn thời hạn trong gói Premium và giới thiệu được 05 khách hàng khác mua gói Premium TRỞ LÊN tính từ thời điểm mua gói của khách hàng tới thời điểm chia Quỹ.'
  ]
]
const dataShareFund = ref([])
const openModal = ref(false)
const mappingDataShareFund = (data) => {
  return data?.map((item, index) => {
    return {
      name: item.name,
      icon: item.icon,
      amount: Number(item.value),
      number_member: item.total,
      contentDetail: DETAILS_SHARE_FUND[index]
    }
  })
}

const fetchShareFund = async () => {
  try {
    const res = await getShareFund()
    dataShareFund.value = mappingDataShareFund(res.data)
  } catch (e) {
    console.log(e)
  }
}
onMounted(() => {
  fetchShareFund()
})
</script>
<style lang="scss">
.share-fund-page {
  @apply w-full;
  .share-fund-page__header {
    border-bottom: 1px solid var(--border-cart-p2p);
    @apply pt-[25px] xl:pt-[73px] pb-3 xl:pb-7 px-[19px] md:px-[33px] w-full;
  }
  .share-fund-page__body {
    @apply py-[27px] px-[19px] md:px-6;

    .item-share-container {
      @apply w-full grid grid-cols-1 md:grid-cols-2 gap-8;
    }
  }
}
</style>
