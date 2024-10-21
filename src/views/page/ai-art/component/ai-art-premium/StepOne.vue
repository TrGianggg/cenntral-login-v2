<template>
  <div class="wrapper-step-one flex justify-center">
    <div
      class="content-step-one w-full"
      :class="[getIsPending ? 'flex items-end' : 'm-auto']"
    >
      <div v-if="!getIsPending">
        <h1 class="text-heading-3 text-gold-150 mb-[20px] md:mb-[36px]">
          {{ $t('ai-art.start_title') }}
        </h1>
        <div class="flex flex-col gap-4">
          <div
            v-for="content in listContentStepOne"
            :key="content.content"
          >
            <p class="text-heading-4 text-gold-150 !font-bold !mb-2">
              {{ content.content }}
            </p>
            <p class="text-body-3 mb-[20px] md:mb-[36px]">
              {{ content.subContent }}
            </p>
          </div>
        </div>
      </div>
      <PendingRender v-if="getIsPending" />
    </div>
  </div>
</template>
<script>
import { aiArtStore } from '@/stores/ai-art'
import { resetHashTag } from '@/helper/const-ai-art'
import PendingRender from '@/views/page/ai-art/component/ai-art-premium/PendingRender.vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  components: { PendingRender },

  setup() {
    const { t } = useI18n()
    const getIsPending = computed(() => {
      return aiArtStore().getIsPending
    })
    const listContentStepOne = ref([
      {
        content: t('ai-art.start_item_title_1'),
        subContent: t('ai-art.start_item_content_1')
      },
      {
        content: t('ai-art.start_item_title_2'),
        subContent: t('ai-art.start_item_content_2')
      },
      {
        content: t('ai-art.start_item_title_3'),
        subContent: t('ai-art.start_item_content_3')
      },
      {
        content: t('ai-art.start_item_title_4'),
        subContent: t('ai-art.start_item_content_4')
      }
    ])
    watch(
      () => getIsPending.value,
      () => {
        if (!getIsPending.value) {
          resetHashTag()
        }
      }
    )
    return { getIsPending, listContentStepOne }
  }
}
</script>
<style scoped lang="scss">
@import '@/design/variable';

.wrapper-step-one {
  @media only screen and (max-width: 639px) {
    padding-top: 80px;
  }
}
/* width */
::-webkit-scrollbar {
  width: 0;
  opacity: 0;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px $color-grey;
  border-radius: 15px;
  opacity: 0;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: $color-primary-border-btn-aigen;
  border-radius: 10px;
  opacity: 0;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: $color-primary-border-btn-aigen;
  opacity: 0;
}
</style>
