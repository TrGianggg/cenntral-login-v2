<template>
  <div
    class="w-9 h-9 rounded-lg cursor-pointer group hover:bg-white-005 transition-500 flex"
    @click="handleClick"
  >
    <img
      :src="IconArrowLeftGold"
      alt="IconArrowLeftGold"
      class="m-auto arrow-gold w-9 h-9 group-hover:scale-110 transition-500"
    />
    <img
      :src="IconArrowLeftBlack"
      alt="IconArrowLeftGold"
      class="m-auto arrow-black w-9 h-9 group-hover:scale-110 transition-500"
    />
  </div>
</template>
<script setup>
import { defineEmits } from 'vue'
import IconArrowLeftGold from '@/assets/icons/icon_arrow_left_gold.svg'
import IconArrowLeftBlack from '@/assets/icons/icon-arrow-left-black.svg'

const emit = defineEmits(['click'])
const handleClick = () => {
  emit('click')
}
</script>
<style lang="scss">
.arrow-gold {
  display: none;
}
.arrow-black {
  display: block;
}
.dark-theme {
  .arrow-gold {
    display: block;
  }
  .arrow-black {
    display: none;
  }
}
</style>
