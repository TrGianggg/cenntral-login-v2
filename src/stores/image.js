import { defineStore } from 'pinia'
import { store } from './index.js'
//
export const useImageStore = defineStore('imageStore', {
    state: () => ({
        isOpenImageModal: false,
        previewImageUrl: '',
        images: []
    }),
    actions: {
        openModal(imageUrl) {
            this.isOpenImageModal = true;
            this.previewImageUrl = imageUrl
        },
        closeModal() {
            this.isOpenImageModal = false;
            this.previewImageUrl = ''
            this.images = []
        },
        setImages(payload) {
            this.images = payload
        },
        setImage(payload) {
            this.previewImageUrl = payload
        }
    }
})

export function useImageStoreWithOut() {
    return useImageStore(store)
}
