<template>
  <div class="flex gap-5 flex-col lg:max-w-[1240px] w-full lg:px-0 px-4">
    <NetworkMemberCardLayout ref="networkMember"/>
    <div class="w-full">
      <div class="bg-neutral-850-2 h-[48px] flex items-center justify-center my-5 rounded-xl">
        <span class="text-[20px] font-bold">{{ $t('network.chart_title') }}</span>
      </div>
      <keep-alive>
        <DetailNodeModal ref="nodeModal"/>
      </keep-alive>
      <NetworkTreeChart @on-click="handleChartClick"/>
    </div>
  </div>
</template>

<script setup>
import NetworkTreeChart from '@/components/network-tree/NetworkTreeChart.vue';
import DetailNodeModal from '@/components/network-tree/DetailNodeModal.vue';
import {useI18n} from "vue-i18n";
import {ref} from "vue";
import NetworkMemberCardLayout from "@/components/network/NetworkMemberCardLayout.vue";
const { t } = useI18n()
const nodeModal = ref(null)
import { useAppStore } from '@/stores/appStore'
const store = useAppStore()
const listBreadcrumb = [
  {
    label: t('layout.menu_main.home'),
    link: '/'
  },
  {
    label:t('network.network')
  }
]
store.setDataBreadCrumb(listBreadcrumb)
const networkMember = ref(null);
const openModal = (data) => {
  nodeModal.value.open(data);
}
const handleChartClick = (data) => {
  setTimeout(() => {
    openModal(data)
  }, 100)
}
</script>