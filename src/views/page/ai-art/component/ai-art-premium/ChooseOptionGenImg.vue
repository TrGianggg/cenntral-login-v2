<template>
  <button
    class="wrapper-btn-choose-option w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
    @click="emitClick"
  >
    <div class="w-full h-full flex items-center justify-center">
      <slot />
    </div>
  </button>
</template>
<script>
export default {
  methods: {
    emitClick(index) {
      this.$emit('emitClick', index)
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/design/variable';
@import '@/design/base.scss';

.wrapper-btn-choose-option {
  border-radius: 6px;
  overflow: hidden;
  box-sizing: content-box;
  position: relative;
  background: var(--bg-option-sidebar-ai) !important;
  border: 1px solid $neutral-400;
}
.wrapper-btn-choose-option:hover {
  border: 1px solid $gold-150;
}

.wrapper-btn-choose-option.first.first_0 {
  img {
    width: 45px;
    height: 45px;
  }
}

.wrapper-btn-choose-option.first.first_1 {
  img {
    width: 30px;
    height: 45px;
  }
}

.wrapper-btn-choose-option.first.first_2 {
  img {
    width: 45px;
    height: 30px;
  }
}
.wrapper-btn-choose-option.not-allow {
  img {
    width: 44px;
    height: 44px;
  }
}

.wrapper-btn-choose-option.active {
  border: 2px solid $gold-150;
}

.wrapper-btn-choose-option.active:after {
  position: absolute;
  content: '';
  background-image: url('@/assets/icons/ai-art/check-circle-icon.svg');
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  z-index: 2;
}

.light-theme {
  .wrapper-btn-choose-option.active:after {
    background-image: url('@/assets/icons/ai-art/check-circle-icon-black.svg');
  }
}

.light-theme {
  .wrapper-btn-choose-option {
    background: var(--bg-cart-2);
  }
}
</style>
