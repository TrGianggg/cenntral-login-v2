<template>
  <a-button
    type="primary"
    @click="emitClick"
  >
    <div class="flex flex-row items-center justify-center">
      <LoadingOutlined v-if="loading"></LoadingOutlined>
      <slot />
    </div>
  </a-button>
</template>
<script>
import { LoadingOutlined } from '@ant-design/icons-vue'
export default {
  components: {
    LoadingOutlined
  },
  methods: {
    emitClick() {
      this.$emit('emitClick')
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/design/variable';

.wrapper-btn-gen-img {
  outline: none;
  background: rgba(151, 143, 124, 0.6);
  border: 0.5px solid $primary-color;
  border-radius: 4px;
  @apply font-normal text-sm;
}
.wrapper-btn-gen-img:hover {
  background: rgba(151, 143, 124, 0.8);
  border: 0.5px solid $primary-color;
}
.wrapper-btn-gen-img.dashed {
  border: 0.5px dashed $primary-color;
}
.wrapper-btn-gen-img.dashed:hover {
  border: 1px dashed $primary-color !important;
  background: rgba(151, 143, 124, 1) !important;
}
</style>
