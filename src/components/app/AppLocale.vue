<template>
  <div class="app_locale_select">
    <a-select
      ref="select"
      dropdownClassName="dropdown-locale-main"
      :bordered="false"
      :trigger="['click']"
      v-model:value="localeSelect"
      @change="handleSetLocale"
    >
      <template #suffixIcon></template>
      <a-select-option
        v-for="item in LIST_SELECT_LOCALE"
        :key="item.value"
        :value="item.value"
        style="width: max-content"
      >
        <div
          class="flex content-locale flex-row-reverse items-center justify-center gap-2.5 select_locale"
        >
          <div class="flex flex-row items-center gap-2">
            <img
              class="w-8 !px-0"
              :src="item.flag"
            />
            <img
              class="icon-arrow-locale"
              src="@/assets/icons/icon_arrow_down_fill.svg"
            />
          </div>
          <span class="title_locale !text-white">{{ item.label }}</span>
        </div>
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import { ref } from 'vue'
import { LIST_SELECT_LOCALE } from '@/locale'
import { useLocaleStore } from '@/stores/locale'

export default {
  setup() {
    const localStore = useLocaleStore()
    const localeSelect = ref(localStore.locale)

    const handleSetLocale = (item) => {
      localStore.setLocale(item)
    }
    return { LIST_SELECT_LOCALE, handleSetLocale, localeSelect }
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';

.dropdown-locale-main {
  padding: 0 !important;
  .icon-arrow-locale {
    display: none;
  }
  .ant-select-item {
    width: 100% !important;
  }

  .content-locale {
    flex-direction: row !important;
  }

  .ant-select-item-option-content {
    span {
      color: $primary-color;
    }
  }
}

.app_locale_select {
  .title_locale {
    opacity: 0;
  }

  .ant-select-selection-item {
    padding-right: 28px !important;
  }

  .ant-select-selector {
    height: 40px !important;
  }

  .select_locale {
    @apply items-center justify-center h-full rounded-2xl;
  }
}
</style>
