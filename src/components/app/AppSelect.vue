<template>
  <div
    class="comp-select bg-neutral-850 h-[36px] px-6 rounded-lg flex justify-between md:justify-start flex-row items-center"
    style="border: 1px solid #2b2b2b"
  >
    <p
      class="text-neutral-400 w-max"
      style="min-width: max-content"
    >
      {{ label }}:
    </p>
    <a-select
      v-model:value="valueSelect"
      :dropdown-match-select-width="false"
      placement="bottomRight"
      class="select-none-border"
    >
      <template #suffixIcon>
        <CaretDownOutlined class="ant-select-suffix !text-neutral-500 text-lg"
      /></template>
      <a-select-option
        v-for="item in listSelect"
        :value="item.value"
        >{{ item.label }}</a-select-option
      >
    </a-select>
  </div>
</template>
<script setup>
import { CaretDownOutlined } from '@ant-design/icons-vue'
import { ref, defineProps, defineEmits, nextTick, watch } from 'vue'

const props = defineProps({
  listSelect: {
    type: Array,
    default: []
  },
  label: {
    type: String,
    default: 'Select'
  }
})

const emit = defineEmits(['fetchValue'])
const valueSelect = ref('')
nextTick(() => {
  valueSelect.value = props.listSelect[0]?.value || ''
})

watch(
  () => valueSelect.value,
  () => {
    emit('fetchValue', valueSelect.value)
  }
)
watch(
  () => props.listSelect,
  () => {
    valueSelect.value = props.listSelect[0]?.value || ''
  }
)
</script>
<style lang="scss">
.comp-select {
  .ant-select-selection-item {
    font-weight: 600;
  }
}
</style>
