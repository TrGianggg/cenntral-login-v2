<template>
  <div
    class="wrapper-upload relative select-none"
    @mouseover="showEditImg"
    @mouseleave="hiddenEditImg"
  >
    <div
      @click="upLoadImage"
      class="relative rounded-[4px] bg-img-upload-temp flex"
    >
      <div
        v-if="isUploadingImg"
        class="w-[210px] h-[107px] rounded-[8px] relative overflow-hidden img-uploaded flex justify-center items-center cell-upload"
      >
        <span class="loader"></span>
      </div>
      <div
        v-if="imageUrl"
        class="w-[210px] h-[107px] rounded-[8px] relative overflow-hidden img-uploaded flex justify-center"
        @mouseover="showEditImg"
      >
        <img
          :src="imageUrl"
          class="absolute z-1 avatar-base w-max h-full object-contain"
          alt=""
        />
        <img
          v-if="!loadingGenImage"
          src="@/assets/icons/ai-art/layer-upload-img.svg"
          class="absolute z-2 avatar-layer w-full h-full object-cover"
          alt=""
        />
        <button
          v-if="!loadingGenImage"
          class="avatar-close absolute z-50 top-[13px] right-[11px]"
          @click.stop="deleteUpload"
        >
          <img
            src="@/assets/icons/ai-art/close-icon.svg"
            alt=""
          />
        </button>
      </div>
      <a-button
        type="primary"
        v-if="!isUploadingImg && !imageUrl"
      >
        {{ $t('ai-art.add-image') }}
      </a-button>
      <input
        type="file"
        class="hidden"
        accept=".png, .jpg, .jpeg"
        id="upLoadImage"
        @change="onChangeImage"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'pinia'
import ButtonGenImg from '@/views/page/ai-art/component/ai-art-premium/ButtonGenImg.vue'
import { computed, reactive, toRefs } from 'vue'
import { MAX_SIZE_IMG_UPLOAD } from '@/helper/const-ai-art'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { aiArtTrialStore } from '@/stores/ai-art-trial'
export default {
  components: {
    ButtonGenImg
  },
  computed: {
    ...mapState(aiArtTrialStore, {
      imageUrl: 'imageUrl',
      imageFile: 'imageFile'
    })
  },
  emits: ['clearImage'],
  setup(_, { emit }) {
    const { t } = useI18n()
    const aiArtTrial = aiArtTrialStore()
    const states = reactive({
      isUploadingImg: false,
      isDisabledUpload: false
    })

    const loadingGenImage = computed(() => {
      return aiArtTrial.loadingGenImage
    })
    const showEditImg = () => {
      const avatarBase = document.querySelector('.avatar-base')
      const avatarLayer = document.querySelector('.avatar-layer')
      const avatarClose = document.querySelector('.avatar-close')
      if (avatarBase) {
        avatarBase.style.display = 'block'
      }
      if (avatarLayer) {
        avatarLayer.style.display = 'block'
      }
      if (avatarClose) {
        avatarClose.style.display = 'block'
      }
      states.isDisabledUpload = false
    }
    const handleAvatarSuccess = (file) => {
      aiArtTrial.setImageFile(file)
      aiArtTrial.setImageUrl(URL.createObjectURL(file))
    }

    const upLoadImage = () => {
      document.getElementById('upLoadImage')?.click()
    }
    const onChangeImage = (event) => {
      const file = event.target.files[0]
      const fileType = ['image/jpeg', 'image/png']
      const isImg = fileType.includes(file.type?.toString())
      const isMaxSize = file.size / 1024 / 1024 < MAX_SIZE_IMG_UPLOAD
      if (!isImg) {
        message.error(t('common.validate.type_image'))
        states.isUploadingImg = false
      } else if (!isMaxSize) {
        message.error(t('common.validate.type_image'))
        states.isUploadingImg = false
      }
      if (isImg && isMaxSize) {
        handleAvatarSuccess(file)
      }
    }

    const hiddenEditImg = () => {
      const avatarBase = document.querySelector('.avatar-base')
      const avatarLayer = document.querySelector('.avatar-layer')
      const avatarClose = document.querySelector('.avatar-close')
      if (avatarBase) {
        avatarBase.style.display = 'block'
      }
      if (avatarLayer) {
        avatarLayer.style.display = 'none'
      }
      if (avatarClose) {
        avatarClose.style.display = 'none'
      }
      states.isDisabledUpload = false
    }
    const deleteUpload = () => {
      states.isDisabledUpload = true
      aiArtTrial.setImageUrl(null)
      aiArtTrial.setImageFile(null)
      emit('clearImage')
    }
    return {
      ...toRefs(states),
      upLoadImage,
      handleAvatarSuccess,
      onChangeImage,
      deleteUpload,
      showEditImg,
      hiddenEditImg,
      loadingGenImage
    }
  }
}
</script>
