import { defineStore } from 'pinia'
import { store } from './index.js'
//
export const aiArtTrialStore = defineStore('aiArtTrialStore', {
  state: () => ({
    imageFile: null,
    loadingGenImage: false,
    imageUrl: null,
    idGenImage: null,
    imageResultAvatar: null,
    dataSourceReGender: null,
    idCancelService: null
  }),
  actions: {
    setImageFile(file) {
      this.imageFile = file
    },
    setImageUrl(url) {
      this.imageUrl = url
    },
    setIdGenImage(id) {
      this.idGenImage = id
    },
    setLoadingGenImage(value) {
      this.loadingGenImage = value
    },
    setImageResultAvatar(value) {
      this.imageResultAvatar = value
    },
    setDataSourceReGender(value) {
      this.dataSourceReGender = value
    },
    setIdCancelService(value) {
      this.idCancelService = value
    }
  }
})

export function useAppStoreWithOut() {
  return aiArtTrialStore(store)
}
