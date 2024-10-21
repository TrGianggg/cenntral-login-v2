<template>
  <div class="relative">
    <a-textarea
      :disabled="isPending"
      id="text-input-art"
      ref="inputSubmit"
      :autocomplete="true"
      v-model:value="states.contentInput"
      :auto-size="{ minRows: 1, maxRows: 3 }"
      class="wrapper-input-gen-img !pr-16"
      :placeholder="$t('ai-art.placeholder')"
    >
    </a-textarea>
    <button
      class="absolute btn-search w-[24px] h-[24px] aspect-square top-1/2 -translate-y-1/2"
      :disabled="isPending || !states.contentInput.trim()"
      @click="emitSend"
    >
      <img
        v-if="!states.contentInput.trim()"
        class="w-full h-full object-center object-cover"
        src="@/assets/icons/ai-art/icon-input-disable.svg"
        alt=""
      />
      <img
        v-else
        class="w-full h-full object-center object-cover"
        src="@/assets/icons/ai-art/icon-input.svg"
        alt=""
      />
    </button>
  </div>
</template>
<script>
import { aiArtStore } from '@/stores/ai-art'
import { MAX_ROWS_TEXT_AREA, MIN_ROWS_TEXT_AREA } from '@/helper/const-ai-art'
import { computed, onMounted, onUpdated, reactive, toRefs, watch } from 'vue'

export default {
  emits: ['emitSend'],
  setup(_, { emit }) {
    const states = reactive({
      contentInput: '',
      minRows: MIN_ROWS_TEXT_AREA,
      maxRows: MAX_ROWS_TEXT_AREA,
      showGenImage: false
    })
    const isPending = computed(() => {
      return aiArtStore().getIsPending
    })
    const textInput = computed(() => {
      return aiArtStore().getTextInput
    })
    const isShowListTagFocus = computed(() => {
      return aiArtStore().getIsShowListTagFocus
    })
    const isCancelService = computed(() => {
      return aiArtStore().getIsCancelService
    })

    const emitSend = () => {
      if (states.contentInput.trim() !== '') {
        aiArtStore().setIsCancelService(false)
        emit('emitSend', states.contentInput)
        aiArtStore().handlesIsPending(true)
        states.contentInput = ''
      }
    }

    onMounted(() => {
      document.addEventListener('DOMContentLoaded', function () {
        const textarea = document.getElementById('text-input-art')
        textarea.addEventListener('input', function () {
          states.contentInput = textarea.value
          states.showGenImage = states.contentInput !== ''
          emit('emitChange', states.contentInput)
        })
      })
    })

    watch(
      () => states.contentInput,
      () => {
        states.showGenImage = states.contentInput !== ''
        emit('emitChange', states.contentInput)
      },
      {
        immediate: true
      }
    )
    return {
      states,
      isPending,
      emitSend,
      textInput,
      isShowListTagFocus,
      isCancelService
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/design/variable';

.wrapper-input-gen-img {
  position: relative;
  @apply py-[20px];

  ::v-deep.el-textarea__inner {
    background: $color-primary-bg-aigen;
    border-radius: 16px;
    color: $color-white;
    font-size: 16px;
    font-weight: 400;
    line-height: 145%;
    padding: 20px 60px 20px 36px;
    border: none;
    box-shadow: none;
    overflow: hidden;
    resize: none;
    @media only screen and (max-width: 496px) {
      padding: 18px 45px 18px 12px !important;
      border-radius: 8px;
    }
  }

  ::placeholder {
    color: $color-primary-border-btn-aigen;
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: $color-primary-border-btn-aigen;
  }

  ::-ms-input-placeholder {
    color: $color-primary-border-btn-aigen;
  }
}

.btn-search {
  position: absolute;
  right: 23px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  z-index: 2;
  @media only screen and (max-width: 496px) {
    right: 15px;
  }
}
</style>
