<template>
  <div
    class="tab-market flex flex-col relative items-center w-full p-3 pb-[100px] md:p-6 bg-neutral-850 rounded-2xl overflow-hidden gap-8"
  >
    <div class="tab-market__filter flex flex-col md:flex-row gap-5 w-full">
      <AppSelect
        :list-select="LIST_TRANSACTION_STATUS"
        :label="$t('common.status')"
        @fetchValue="fetchValueStatus"
      ></AppSelect>
      <AppSelect
        :list-select="LIST_SORT"
        :label="$t('common.sort')"
        @fetchValue="fetchValueSort"
      ></AppSelect>
    </div>
    <div class="tab-market__cart grid grid-cols-1 md:grid-cols-2 w-full gap-4">
      <CartTradeStatus
        v-for="item in states.data"
        :key="item"
        :data-cart="item"
      ></CartTradeStatus>
    </div>
    <a-pagination
      v-if="states.total > states.limit"
      :total="states.total"
      :show-size-changer="false"
      @change="fetchPage"
      class="select-none"
    ></a-pagination>
  </div>
</template>
<script setup>
import AppSelect from '@/components/app/AppSelect.vue'
import CartTradeStatus from '@/views/page/tomxu/component/CartTradeStatus.vue'
import { fetchDataAgencyApi } from '@/api/tomxu'
import { onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatNumber } from '@/helper/ultil.js'

const { t } = useI18n()
const LIST_TRANSACTION_STATUS = [
  {
    label: t('common.all'),
    value: ''
  },
  {
    label: 'Online',
    value: 'online'
  },
  {
    label: 'Offline',
    value: 'offline'
  },
  {
    label: 'Busy',
    value: 'busy'
  }
]

const LIST_SORT = [
  {
    label: t('tomxu.volume_transaction'),
    value: 'volumeTrading:'
  },
  {
    label: t('tomxu.amount_transaction'),
    value: 'numTrading:'
  }
]

const states = reactive({
  data: [],
  status: '',
  sort: 'volumeTrading:',
  loading: false,
  valueSort: 'DESC',
  page: 1,
  total: 0
})

const fetchValueStatus = (data) => {
  states.status = data
  states.page = 1
  fetchDataAgency()
}
const fetchValueSort = (data) => {
  states.sort = data
}

const fetchPage = (page) => {
  states.page = page
}

const mapDataAgency = (data) => {
  return data?.map((item) => {
    return {
      agency_name: item.displayName,
      status: item.status,
      count_transaction: formatNumber(item.numTrading || 0),
      value_transaction: formatNumber(item.volumeTrading || 0),
      number_phone: item?.zaloLink?.replace('https://zalo.me/', ''),
      link_telegram: item?.telegramLink?.replace('https://t.me/', '')
    }
  })
}
const fetchDataAgency = async () => {
  const params = {
    limit: 8,
    page: states.page,
    order: states.sort + states.valueSort
  }
  if (states.status) {
    params['filters'] = {
      status: states.status
    }
  }
  try {
    const data = await fetchDataAgencyApi(params)
    states.data = mapDataAgency(data.data)
    states.total = data.meta.totalItems
  } catch (e) {
    console.log(e)
  }
}
watch(
  () => [states.page, states.sort],
  () => {
    fetchDataAgency()
  }
)
onMounted(() => {
  fetchDataAgency()
})
</script>
