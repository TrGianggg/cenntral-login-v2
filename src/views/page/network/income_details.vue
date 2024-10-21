<template>
  <div class="flex flex-col lg:flex-row gap-4 mt-5 lg:max-w-[1240px] w-full px-3 lg:px-0">
    <div class="bg-neutral-850-2 p-6 rounded-xl flex flex-col gap-6 w-full lg:w-[295px] h-max">
      <div class="flex flex-col gap-3">
        <div class="text-white font-bold">Thu nhập từ hệ thống</div>
        <div class="flex justify-between items-end min-h-[40px]">
          <span class="flex items-center">
            <BaseLoader
              v-if="loading"
              height="30"
              width="100"
            />
            <span v-else>
              <span class="leading-none text-heading-3 text-primary-color">
                {{ formatNumber(countData.incomePXU) }}
              </span>
              <span class="font-bold text-white pl-2"> P</span>
            </span>
          </span>
        </div>
        <div class="flex justify-between items-end min-h-[40px]">
          <span class="flex items-center">
            <BaseLoader
              v-if="loading"
              height="30"
              width="100"
            />
            <span v-else>
              <span class="leading-none text-heading-3 text-primary-color">
                {{ formatNumber(countData.incomeXU) }}
              </span>
              <span class="font-bold text-white pl-2"> CP</span>
            </span>
          </span>
        </div>
      </div>
    </div>
    <div
      class="w-full flex flex-col relative pb-[34px] bg-neutral-850 rounded-2xl gap-8 items-center p-4 border shadow-light"
    >
      <div class="flex md:flex-row gap-5 w-full flex-col">
        <AppSelect
          label="Loại giao dịch"
          :list-select="listTypeTransaction"
          @fetchValue="fetchValueTypeTransaction"
        ></AppSelect>
        <AppSelect
          label="Loại CP"
          :list-select="listToken"
          @fetchValue="fetchValueToken"
        ></AppSelect>
      </div>
      <a-table
        class="ant-table-striped w-full"
        :loading="states.loading"
        :columns="columns"
        :data-source="states.dataTable"
        :pagination="false"
        :scroll="{ x: 970 }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'createdAt'">
            <div
              @click="handleChangeSort(column.key)"
              class="flex flex-row items-center cursor-pointer gap-2"
            >
              <span>{{ column.title }}</span>
              <AppSort
                :sort-value="states.valueSort"
                v-if="states.keySort === column.key"
              ></AppSort>
            </div>
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'code_transaction'">
            <a-tooltip :title="record.code_transaction">
              <span class="text-neutral-400 line-clamp-1 max-w-[80px]">{{
                record.code_transaction || '#######'
              }}</span>
            </a-tooltip>
          </template>
          <template v-if="column.key === 'type_transaction'">
            <div>
              <TagsLabelCustom :type="record.type_transaction"></TagsLabelCustom>
            </div>
          </template>
          <template v-if="column.key === 'amount'">
            <span
              style="white-space: nowrap"
              class="text-body-4"
              >{{ record.amount >= 0 ? '+' : '-' }} {{ formatNumber(record.amount) }}</span
            >
          </template>
          <template v-if="column.key === 'message'">
            <span>{{ record.message || '-' }}</span>
          </template>
          <template v-if="column.key === 'token'">
            <span>{{ record.token || '-' }}</span>
          </template>
          <template v-if="column.key === 'createdAt'">
            <span>{{ formatDate(record.time) }}</span>
          </template>
        </template>
      </a-table>
      <a-pagination
        :total="states.total"
        @change="fetchPage"
        :show-size-changer="false"
        :default-page-size="states.limit"
        class="select-none"
      ></a-pagination>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { formatDecimalNumber, formatDate } from '@/helper'
import TagsLabelCustom from '@/components/app/TagsLabelCustom.vue'
import { useI18n } from 'vue-i18n'
import { fetchDataTransferApi } from '@/api/tomxu'
import { formatNumber } from '@/helper/ultil.js'
import { ContentLoader } from 'vue-content-loader'
import { useAppStore } from '@/stores/appStore'
import { getUserIncomeHistoryApi, ternaryTreeApi } from '@/api/network'
import AppSelect from '@/components/app/AppSelect.vue'
import { masterDataStore } from '@/stores/masterDataStore'
import AppSort from '@/components/app/AppSort.vue'
import BaseLoader from '@/components/shared/BaseLoader.vue'

const { t } = useI18n()

const masterData = masterDataStore()
const listTypeTransaction = computed(() => {
  return masterData.getListIncomeType
})
const listToken = computed(() => {
  return masterData.getListToken
})
const columns = [
  {
    title: t('tomxu.table_transaction_manager.column_1'),
    dataIndex: 'code_transaction',
    key: 'code_transaction'
  },
  {
    title: t('tomxu.table_transaction_manager.column_2'),
    dataIndex: 'type_transaction',
    key: 'type_transaction'
  },
  {
    title: t('tomxu.table_transaction_manager.column_3'),
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: 'Người mua gói',
    dataIndex: 'message',
    key: 'message'
  },
  {
    title: t('tomxu.table_transaction_manager.column_8'),
    dataIndex: 'token',
    key: 'token'
  },
  {
    title: t('tomxu.table_transaction_manager.column_6'),
    dataIndex: 'createdAt',
    key: 'createdAt'
  }
]

const states = reactive({
  dataTable: [],
  loading: false,
  limit: 10,
  page: 1,
  total: 0,
  typeTransaction: '',
  token: '',
  valueSort: 'DESC',
  keySort: 'createdAt'
})

const store = useAppStore()
const listBreadcrumb = [
  {
    label: t('layout.menu_main.home'),
    link: '/'
  },
  {
    label: t('network.network'),
    link: '/network'
  },
  {
    label: 'Chi tiết thu nhập'
  }
]
store.setDataBreadCrumb(listBreadcrumb)
const mapDataTransferTable = (data) => {
  return data.map((item) => {
    return {
      key: data.indexOf(item),
      code_transaction: item.hash,
      type_transaction: item.type,
      token: item.token,
      fee: item.fee,
      amount: item.value,
      message: item.message,
      from: item.fromName === 'null null' ? '-' : item.fromName,
      to: item.toName === 'null null' ? '-' : item.toName,
      time: item.createdAt
    }
  })
}

const countData = ref({
  incomeXU: '',
  incomePXU: ''
})

const fetchValueTypeTransaction = async (value) => {
  states.page = 1
  states.typeTransaction = value
}

const fetchValueToken = async (value) => {
  states.page = 1
  states.token = value
}

const loading = ref(false)

const fetchMemberData = () => {
  loading.value = true
  ternaryTreeApi().then(
    (resp) => {
      loading.value = false
      countData.value = resp
    },
    () => {
      loading.value = false
    }
  )
}
fetchMemberData()

const fetchDataTransfer = async () => {
  states.loading = true
  const params = {
    limit: states.limit,
    page: states.page,
    order: states.keySort + ':' + states.valueSort,
    filters: {
      type: '',
      token: ''
    }
  }
  const filters = {}
  if (states.typeTransaction) {
    filters['type'] = states.typeTransaction
  }

  if (states.token) {
    filters['token'] = states.token
  }

  // if (filters !== {}) {
  //   params['filters'] = filters
  // }
  try {
    const res = await getUserIncomeHistoryApi(params)
    states.dataTable = mapDataTransferTable(res.data)
    states.total = res.meta.totalItems
  } catch (e) {
    console.log(e)
  } finally {
    states.loading = false
  }
}

const handleChangeSort = async (key) => {
  if (states.keySort === key) {
    states.valueSort = states.valueSort === 'DESC' ? 'ASC' : 'DESC'
  } else {
    states.keySort = key
  }
}

const fetchPage = (page) => {
  states.page = page
  fetchDataTransfer()
}

watch(
  () => [states.valueSort, states.keySort, states.token, states.typeTransaction],
  () => {
    fetchDataTransfer()
  }
)

onMounted(() => {
  fetchDataTransfer()
})
</script>
