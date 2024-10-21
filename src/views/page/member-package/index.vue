<template>
  <div class="member-package w-full">
    <TomixuCard></TomixuCard>
    <div class="xl:mt-[82px] mt-6">
      <component
        :is="statusPackage"
        @changeBuyPackage="changeBuyPackage"
        :dataPackage="dataPackage"
      ></component>
    </div>
  </div>
</template>
<script>
import { computed, onMounted, ref, watch } from 'vue'
import BuyPackage from '@/views/page/member-package/BuyPackage.vue'
import OptionPackage from '@/views/page/member-package/OptionPackage.vue'
import { masterDataStore } from '@/stores/masterDataStore'
import TomixuCard from '@/components/feed/TomixuCard.vue'
export default {
  components: {
    TomixuCard,
    OptionPackage,
    BuyPackage
  },
  setup() {
    const statusPackage = ref('OptionPackage')

    const dataPackage = computed(() => {
      return masterDataStore().getPackage
    })

    const changeBuyPackage = () => {
      statusPackage.value = statusPackage.value === 'BuyPackage' ? 'OptionPackage' : 'BuyPackage'
    }

    return {
      statusPackage,
      dataPackage,
      changeBuyPackage
    }
  }
}
</script>
