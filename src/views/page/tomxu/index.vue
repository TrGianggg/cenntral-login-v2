<template>
  <div class="w-full padding-side-global flex">
    <div class="tom-xu-page w-full mx-auto max-w-[1240px] flex flex-col gap-8">
      <div class="tom-xu-page__body grid grid-cols-16 gap-6 mt-[24px] md:mt-[41px]">
        <div class="tom-xu-page__body-left lg:col-span-4">
          <LeftBox></LeftBox>
        </div>
        <div
          class="tom-xu-page__body-right lg:col-span-12 flex flex-col gap-5 shadow-light rounded-2xl"
        >
          <a-tabs
            v-model:active-key="activeKey"
            class="tab-tomxu-manager"
          >
            <a-tab-pane
              v-for="tab in listTab"
              :tab="tab.label"
              :key="tab.value"
            ></a-tab-pane>
          </a-tabs>
          <keep-alive>
            <component :is="activeKey"></component>
          </keep-alive>
        </div>
      </div>
    </div>
    <div
      v-if="getCurrentRoute.tab === 'TabMarket'"
      class="fixed bottom-4 right-6 xl:bottom-[48px] xl:right-[35px] 3xl:top-[101px]"
    >
      <Hotline></Hotline>
    </div>
  </div>
</template>
<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Breadcrumb from '@/components/app/Breadcrumb.vue'
import LeftBox from '@/views/page/tomxu/component/LeftBox.vue'
import TabManagerTransaction from '@/views/page/tomxu/component/TabManagerTransaction.vue'
import TabMarket from '@/views/page/tomxu/component/TabMarket.vue'
import router from '@/router'
import { useAppStore } from '@/stores/appStore'
import Hotline from '@/components/tomxu-manager/Hotline.vue'
import { supportStore, KEY_SUPPORT } from '@/stores/support'
export default {
  components: { TabManagerTransaction, Hotline, TabMarket, Breadcrumb, LeftBox },
  setup() {
    const { t } = useI18n()
    const activeKey = ref('TabManagerTransaction')
    const listBreadcrumb = [
      {
        label: t('layout.menu_main.home'),
        link: '/'
      },
      {
        label: t('layout.menu_main.tom_xu')
      }
    ]

    const listTab = [
      {
        label: t('tomxu.tab_1'),
        value: 'TabManagerTransaction'
      },
      {
        label: t('tomxu.tab_2'),
        value: 'TabMarket'
      }
    ]
    const getCurrentRoute = computed(() => {
      return router.currentRoute.value.query
    })

    const getTabQuery = () => {
      if (getCurrentRoute.value.tab) {
        activeKey.value = getCurrentRoute.value.tab
      } else {
        activeKey.value = 'TabManagerTransaction'
      }
    }

    watch(
      () => getCurrentRoute.value,
      () => {
        getTabQuery()
      },
      { deep: true }
    )

    watch(
      () => activeKey.value,
      () => {
        router.push({
          query: {
            tab: activeKey.value
          }
        })
      }
    )
    const setDataBreadCrumb = () => {
      const data = [
        {
          label: 'Trang chủ',
          link: '/'
        },
        {
          label: 'Quản lý Tomxu'
        }
      ]
      useAppStore().setDataBreadCrumb(data)
    }

    onMounted(() => {
      getTabQuery()
      setDataBreadCrumb()
      supportStore().setKey(KEY_SUPPORT.TRANSACTIONTOMXU)
    })
    return { listTab, listBreadcrumb, getCurrentRoute, activeKey }
  }
}
</script>
