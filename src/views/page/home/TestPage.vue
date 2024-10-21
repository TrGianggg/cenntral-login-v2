<template>
  <div class="w-[1024px] mx-4">
    <div class="h-[60px]"></div>
    <Breadcrumb :data-breadcrumb="listBreadcrumb"></Breadcrumb>
    <div class="bg-neutral-850 h-[60px] flex items-center justify-center my-5 rounded-2xl">
      <span class="text-[20px] text-primary-color font-bold">Khám phá mạng lưới</span>
    </div>
    <NetworkTreeChart @on-click="handleChartClick"/>
    <DetailNodeModal ref="nodeModal"/>
  </div>
</template>

<script setup>
import NetworkTreeChart from '@/components/network-tree/NetworkTreeChart.vue';
import Breadcrumb from "@/components/app/Breadcrumb.vue";
import DetailNodeModal from '@/components/network-tree/DetailNodeModal.vue';
import {useI18n} from "vue-i18n";
import {ref} from "vue";
const { t } = useI18n()
const nodeModal = ref(null)
const listBreadcrumb = [
  {
    label: t('layout.menu_main.home'),
    link: '/'
  },
  {
    label: 'Mạng lưới'
  }
]
const handleChartClick = (data) => {
  nodeModal.value.open(data);
}
</script>