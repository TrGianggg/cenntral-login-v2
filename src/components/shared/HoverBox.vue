<template>
  <div class="hover-box hover:bg-gold-200"
       :style="{
          width: `${size}px`,
          minWidth: `${size}px`,
          height: `${size}px`
       }">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 32
  }
})
</script>

<style scoped lang="scss">
.hover-box {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .3s;
  background: transparent;
  &:hover {
    background: var(--bg-box-hover);
  }
}
</style>