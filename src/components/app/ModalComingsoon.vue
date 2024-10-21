<template>
  <a-modal
    centered
    @cancel="afterClose"
    wrapClassName="modal-transfer-tomxu"
    v-model:visible="states.visible"
  >
    <div class="flex flex-col items-center justify-between gap-6 my-8">
      <ComingSoon class="!mt-6"></ComingSoon>
    </div>
  </a-modal>
</template>
<script setup>
import { computed, reactive, watch } from 'vue'
import ComingSoon from '@/components/app/ComingSoon.vue'
import { useAppStore } from '@/stores/appStore'

const states = reactive({
  visible: false
})

const modalComingSoon = computed(() => {
  return useAppStore().modalComingSoon
})

const afterClose = () => {
  useAppStore().setModalComingSoon(false)
}

watch(
  () => modalComingSoon.value,
  () => {
    states.visible = modalComingSoon.value
  }
)
</script>
