<template>
  <div
    class="flex flex-col relative mb-12 pb-6 items-center w-full p-3 md:p-6 bg-neutral-850 rounded-2xl overflow-hidden gap-8"
  >
    <div class="tab-market__filter flex flex-col md:flex-row gap-5 w-full">
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
      :columns="columns"
      :data-source="states.dataTable"
      :pagination="false"
      :scroll="{ x: 1000 }"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'value'">
          <div
            class="flex flex-row items-center cursor-pointer gap-2"
            @click="handleChangeSort(column.key)"
          >
            <span>{{ column.title }}</span>
            <AppSort
              v-if="states.keySort === column.key"
              :sort-value="states.valueSort"
            ></AppSort>
          </div>
        </template>
        <template v-if="column.key === 'from'">
          <div
            class="flex flex-row items-center cursor-pointer gap-2"
            @click="handleChangeSort(column.key)"
          >
            <span>{{ column.title }}</span>
            <AppSort
              v-if="states.keySort === column.key"
              :sort-value="states.valueSort"
            ></AppSort>
          </div>
        </template>
        <template v-if="column.key === 'to'">
          <div
            class="flex flex-row items-center cursor-pointer gap-2"
            @click="handleChangeSort(column.key)"
          >
            <span>{{ column.title }}</span>
            <AppSort
              v-if="states.keySort === column.key"
              :sort-value="states.valueSort"
            ></AppSort>
          </div>
        </template>
        <template v-if="column.key === 'createdAt'">
          <div
            class="flex flex-row items-center cursor-pointer gap-2"
            @click="handleChangeSort(column.key)"
          >
            <span>{{ column.title }}</span>
            <AppSort
              v-if="states.keySort === column.key"
              :sort-value="states.valueSort"
            ></AppSort>
          </div>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'code_transaction'">
          <a-tooltip :title="record.code_transaction">
            <span class="text-neutral-400 line-clamp-1 max-w-[50px]">{{
              record.code_transaction || '#######'
            }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'type_transaction'">
          <div>
            <TagsLabelCustom :type="record.type_transaction"></TagsLabelCustom>
          </div>
        </template>
        <template v-if="column.key === 'value'">
          <span
            v-if="record.amount"
            style="white-space: nowrap"
            class="text-body-4"
            >{{ record.typeValue }}{{ formatNumber(record.amount) }}</span
          >
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'to'">
          <div class="flex flex-col">
            <span>{{ record.to }}</span>
            <span v-if="record.toEmail">({{ record.toEmail }})</span>
          </div>
        </template>
        <template v-if="column.key === 'from'">
          <div class="flex flex-col">
            <span>{{ record.from }}</span>
            <span v-if="record.fromEmail">({{ record.fromEmail }})</span>
          </div>
        </template>
        <template v-if="column.key === 'fee'">
          <span>{{ formatNumber(record.fee) }}</span>
        </template>
        <template v-if="column.key === 'message'">
          <span>{{ record.message }}</span>
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
      v-if="states.total > states.limit"
      :total="states.total"
      show-less-items
      :show-size-changer="false"
      class="select-none"
      @change="fetchPage"
    ></a-pagination>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { formatDate } from '@/helper'
import { useI18n } from 'vue-i18n'
import { fetchDataTransferApi } from '@/api/tomxu'
import { formatNumber } from '@/helper/ultil.js'
import TagsLabelCustom from '@/components/app/TagsLabelCustom.vue'
import AppSelect from '@/components/app/AppSelect.vue'
import AppSort from '@/components/app/AppSort.vue'
import { masterDataStore } from '@/stores/masterDataStore'

const { t } = useI18n()
const masterData = masterDataStore()
const listTypeTransaction = computed(() => {
  return masterData.getListTransactionsType
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
    dataIndex: 'value',
    key: 'value'
  },
  {
    title: t('tomxu.table_transaction_manager.column_4'),
    dataIndex: 'from',
    key: 'from'
  },
  {
    title: t('tomxu.table_transaction_manager.column_5'),
    dataIndex: 'to',
    key: 'to'
  },
  {
    title: t('tomxu.table_transaction_manager.column_7'),
    dataIndex: 'fee',
    key: 'fee'
  },
  {
    title: t('tomxu.table_transaction_manager.column_8'),
    dataIndex: 'token',
    key: 'token'
  },
  {
    title: t('tomxu.table_transaction_manager.column_9'),
    dataIndex: 'message',
    key: 'message'
  },
  {
    title: t('tomxu.table_transaction_manager.column_6'),
    dataIndex: 'time',
    key: 'createdAt'
  }
]
//
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

const mapDataTransferTable = (data) => {
  return data.map((item) => {
    return {
      key: data.indexOf(item),
      code_transaction: item.hash,
      type_transaction: item.type,
      token: item.token,
      fee: item.fee,
      message: item.message,
      typeValue: item.typeValue,
      amount: item.value,
      from: item.fromName === 'null null' ? '-' : item.fromName,
      to: item.toName === 'null null' ? '-' : item.toName,
      toEmail: item.toEmail,
      fromEmail: item.fromEmail,
      time: item.createdAt
    }
  })
}

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
    const res = await fetchDataTransferApi(params)
    states.dataTable = mapDataTransferTable(res.data)
    states.total = res.meta.totalItems
  } catch (e) {
    console.log(e)
  } finally {
    states.loading = false
  }
}

const fetchPage = (page) => {
  states.page = page
  fetchDataTransfer()
}

const fetchValueTypeTransaction = async (value) => {
  states.page = 1
  states.typeTransaction = value
}

const fetchValueToken = async (value) => {
  states.page = 1
  states.token = value
}

const handleChangeSort = async (key) => {
  console.log(key)
  if (states.keySort === key) {
    states.valueSort = states.valueSort === 'DESC' ? 'ASC' : 'DESC'
  } else {
    states.keySort = key
  }
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
