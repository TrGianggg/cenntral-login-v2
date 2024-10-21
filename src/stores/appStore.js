import { defineStore } from 'pinia'
import { store } from './index.js'
import { TYPE_LAYOUT } from '@/helper/layout-contant'
//
export const useAppStore = defineStore('appStore', {
  state: () => ({
    layout: TYPE_LAYOUT.DEFAULT,
    isExpandMenu: false,
    dataBreadCrumb: [],
    modalComingSoon: false,
  }),
  actions: {
    setLayout(type) {
      this.layout = type
    },
    setModalComingSoon(value) {
      this.modalComingSoon = value
    },
    setExpandMenu(value) {
      this.isExpandMenu = value
    },
    setDataBreadCrumb(value) {
      this.dataBreadCrumb = value
    }
  }
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
