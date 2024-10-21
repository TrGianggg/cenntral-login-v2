<template>
  <div class="flex flex-col cursor-pointer">
    <CaretUpOutlined
      class="!mb-0"
      :style="`opacity: ${sortValue === 'DESC' ? '0.5' : '1'}`"
    ></CaretUpOutlined>
    <CaretDownOutlined
      :style="`opacity: ${sortValue === 'DESC' ? '1' : '0.5'}`"
    ></CaretDownOutlined>
    <div v-html="test"></div>
  </div>
</template>
<script>
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue'

export default {
  components: {
    CaretDownOutlined,
    CaretUpOutlined
  },
  props: {
    sortValue: {
      type: String,
      default: '32px'
    },
    test: {
      type: String,
      default: ''
    }
  }
}
</script>
