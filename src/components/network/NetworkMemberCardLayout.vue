<template>
  <div class="flex lg:flex-row flex-col justify-between">
    <div class="mt-5 h-max">
      <div class="text-[20px] font-bold py-3">
        <span>{{ $t('network.detail') }}</span>
      </div>
      <div class="flex gap-4 md:flex-row flex-col">
        <div
          class="bg-neutral-850-2 p-4 rounded-xl flex flex-col gap-6 lg:w-[295px] w-full min-h-[130px]"
        >
          <div class="flex flex-col justify-between gap-3 h-full">
            <div class="text-white font-bold">{{ $t('network.f1_label') }}</div>
            <div class="flex justify-between items-center min-h-[40px]">
              <span class="text-primary-color text-heading-3 flex items-center">
                <BaseLoader
                  v-if="loading"
                  height="30"
                  width="100"
                />
                <span
                  v-else
                  class="leading-none"
                >
                  {{ formatNumber(countData.f1.length) }}
                </span>
              </span>
              <div
                class="cs-button text-primary-150"
                @click="downloadMember"
              >
                <span>{{ $t('network.download') }}</span>
                <IconDownload />
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-neutral-850-2 p-4 rounded-xl flex flex-col gap-6 lg:w-[295px] w-full min-h-[130px]"
        >
          <div class="flex flex-col justify-between gap-3 h-full">
            <div class="text-white font-bold">
              {{ $t('network.not_f1_label') }}
            </div>
            <div class="flex justify-between items-center min-h-[40px]">
              <span class="text-primary-color text-heading-3 flex items-center">
                <BaseLoader
                  v-if="loading"
                  height="30"
                  width="100"
                />
                <span v-else>
                  {{ formatNumber(countData.f1NotMember.length) }}
                </span>
              </span>
              <div
                class="cs-button text-primary-150"
                @click="downloadMember(false)"
              >
                <span>{{ $t('network.download') }}</span>
                <IconDownload />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 h-max">
      <div class="text-[20px] font-bold py-3">
        <span>Thu nhập từ hệ thống</span>
      </div>

      <div class="flex gap-4 md:flex-row flex-col">
        <div
          class="bg-neutral-850-2 p-4 rounded-xl flex flex-col gap-6 min-h-[130px] lg:w-[235px] w-full"
        >
          <div class="flex flex-col gap-3 h-full justify-between flex-1">
            <div class="flex justify-between items-end min-h-[40px]">
              <span class="flex items-center">
                <BaseLoader
                  v-if="loading"
                  height="30"
                  width="100"
                />
                <span
                  v-else
                  class="leading-none text-heading-3 text-primary-color"
                >
                  {{ formatNumber(countData.incomeXU) }}
                </span>
                <span class="font-bold text-white pl-2"> CP</span>
              </span>
            </div>
            <div
              class="cs-button text-primary-150"
              @click="goToDetailIncome(false)"
            >
              <span>Xem chi tiết</span>
            </div>
          </div>
        </div>
        <div
          class="bg-neutral-850-2 p-4 rounded-xl flex flex-col gap-6 min-h-[130px] lg:w-[235px] w-full"
        >
          <div class="flex flex-col gap-3 h-full justify-between flex-1">
            <div class="flex justify-between items-end min-h-[40px]">
              <span class="flex items-center">
                <BaseLoader
                  v-if="loading"
                  height="30"
                  width="100"
                />
                <span
                  v-else
                  class="leading-none text-heading-3 text-primary-color"
                >
                  {{ formatNumber(countData.incomePXU) }}
                </span>
                <span class="font-bold text-white pl-2"> P</span>
              </span>
            </div>
            <div
              class="cs-button text-primary-150"
              @click="goToDetailIncome(false)"
            >
              <span>Xem chi tiết</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ternaryTreeApi } from '@/api/network'
import IconDownload from '@/components/shared/icons/IconDownload.vue'
import { ref } from 'vue'
import { formatFullTime, formatNumber } from '@/helper/ultil'
import ExcelJS from 'exceljs'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BaseLoader from '@/components/shared/BaseLoader.vue'

const { t } = useI18n()
const countData = ref({
  f1: [],
  f1NotMember: [],
  incomeXU: '',
  incomePXU: ''
})
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

const downloadMember = async (isF1 = true) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet 1')

  const filename = isF1 ? 'members_f1.xlsx' : 'members_non_f1.xlsx'
  const dataSheet = isF1 ? countData.value.f1 : countData.value.f1NotMember

  worksheet.addRow([
    'STT',
    'Username',
    'Email',
    t('network.register_time'),
    t('network.is_member'),
    t('network.last_register_member_time')
  ])
  dataSheet.forEach((item, index) => {
    worksheet.addRow([
      index + 1,
      item.username,
      item.email,
      formatFullTime(item.createdAt),
      item.isMember ? 'YES' : '',
      item.buyPackageAt ? formatFullTime(item.buyPackageAt) : ''
    ])
  })
  const columnB = worksheet.getColumn('B')
  columnB.width = 30
  const columnC = worksheet.getColumn('C')
  columnC.width = 30
  const columnD = worksheet.getColumn('D')
  columnD.width = 30
  const columnE = worksheet.getColumn('E')
  columnE.width = 25
  const columnF = worksheet.getColumn('F')
  columnF.width = 50
  const blob = await workbook.xlsx.writeBuffer()

  const blobURL = window.URL.createObjectURL(
    new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  )

  const a = document.createElement('a')
  a.href = blobURL
  a.download = filename

  a.click()

  window.URL.revokeObjectURL(blobURL)
}

const router = useRouter()
const goToDetailIncome = () => {
  router.push({
    name: 'IncomeDetails'
  })
}
</script>

<style lang="scss">
.cs-button {
  @apply btn-hover-150 cursor-pointer bg-primary-01 rounded-full min-w-[120px] h-[36px] flex items-center gap-2 font-bold justify-center;
}
.btn-hover-150 {
  &:hover {
    //background: rgba(255, 255, 255, 0.20);
    background: var(--color-white-02);
  }
}
</style>
