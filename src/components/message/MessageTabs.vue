<template>
  <div class="flex flex-row justify-between select-none w-full">
    <div
        v-for="tab in listTab"
        :key="tab.value"
        :class="[
          'px-3 md:px-4 cursor-pointer py-4 border-b-2 border-solid relative flex-1 flex justify-center',
          activeTab === tab.value
            ? 'border-white text-white'
            : 'border-transparent'
        ]"
        @click="handleSelectTab(tab)"
    >
      <div class="text-[14px] flex items-center gap-2">
        <span :class="{'font-bold': activeTab === tab.value}">
          {{ tab.label }}
        </span>
        <div v-if="countData[tab.countKey]"
             class="count-item">
          {{ countData[tab.countKey] > 99 ? '99+' : countData[tab.countKey] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {getCountMessageApi} from "@/api/message";
import {useMessageStore} from "@/stores/messageStore";
const store = useMessageStore();

const emit = defineEmits(['on-change'])
const activeTab = ref('ALL')
const countData = ref({})
const currentMessageCount = computed(() => store.countData);
const listTab = computed(() => {
  return [
    {
      value: 'ALL',
      countKey: 'countNewAll',
      label: 'Tất cả'
    },
    {
      value: 'group',
      countKey: 'countNewGroup',
      label: 'Nhóm'
    },
    {
      value: 'chat',
      countKey: 'countNewChat',
      label: 'Mọi người'
    },
  ]
})

watch(currentMessageCount, () => {
  countData.value = currentMessageCount.value;
}, { immediate: true, deep: true })

const fetchCountData = () => {
  getCountMessageApi().then(resp => {
    store.setCountData(resp);
  })
}
fetchCountData();


const handleSelectTab = (tab) => {
  activeTab.value = tab.value;
  if (tab.value === 'ALL') {
    emit('on-change', { value: '' })
  } else {
    emit('on-change', tab)
  }
}
</script>

<style scoped>
.count-item {
  position: absolute;
  top: -4px;
  right: 3px;
}
</style>
