<template>
  <div class="gen-avatar-page w-full select-none h-full flex">
    <button
      v-if="!loadingGenImage && !imageResultAvatar"
      :disabled="!imageFile"
      :class="['gen-avatar-button flex m-auto select-none', imageFile ? '' : 'cursor-not-allowed']"
      @click="handleInteractionImage"
    >
      <span
        class="flex m-auto px-6 w-[150px] aspect-square rounded-xl bg-neutral-700"
        :class="imageFile ? 'gen-avatar-button-content' : ''"
      >
        <img
          class="w-[80%] m-auto"
          :src="imageFile ? IconButtonMagic : IconButtonMagicDisable"
          :alt="imageUrl"
        />
      </span>
    </button>
    <div
      v-if="loadingGenImage"
      class="w-full flex flex-col max-w-[500px] m-auto gap-4"
    >
      <div class="gen-avatar-page__loading w-full aspect-square">
        <div
          class="item-block-loading rounded-[16px] animate-pulse w-full m-auto flex items-center justify-center"
          style="aspect-ratio: 1 / 1; background: #3e3c32"
        >
          <span class="loader"></span>
        </div>
      </div>
      <div class="flex justify-between items-start">
        <button
          class="btn-cancel-pending w-full min-h-[40px] flex items-center justify-center mt-[0px] rounded-[4px] mb-12 relative"
          @click="handleCancelGenImage"
        >
          <img
            src="@/assets/icons/ai-art/icon_close-pending.svg"
            alt=""
          />
          <span class="text-white text-sm font-xs ml-2">{{ $t('common.cancel') }}</span>
        </button>
      </div>
    </div>
    <div
      v-if="!loadingGenImage && imageResultAvatar"
      class="w-full flex flex-col gap-4"
    >
      <div class="w-full max-w-[500px] relative m-auto">
        <img
          :src="imageResultAvatar"
          alt="imageResult"
        />
        <div class="absolute button-re-gen-image top-0 w-full h-full flex group">
          <div
            class="!hidden group-hover:!flex m-auto transition-500 select-none flex-col items-center gap-4"
          >
            <button
              :disabled="!imageFile"
              :class="[
                'gen-avatar-button',
                imageFile ? 'allowed-gen-avatar' : 'cursor-not-allowed'
              ]"
              @click="handleInteractionImage"
            >
              <span
                class="gen-avatar-button-content flex m-auto px-6 w-[150px] aspect-square rounded-xl bg-neutral-700"
              >
                <img
                  class="w-[80%] m-auto button-send"
                  :src="imageFile ? IconButtonMagic : IconButtonMagicDisable"
                  :alt="imageUrl"
                />
              </span>
            </button>
            <p
              v-if="imageUrl"
              class="text-heading-4 text-[#FFD24B]"
            >
              Tạo lại ảnh
            </p>
          </div>
        </div>
      </div>
      <div class="w-full max-w-[500px] mx-auto flex flex-col items-center gap-6 justify-center">
        <a-button
          type="primary"
          :loading="states.loadingDownload"
          :disabled="states.loadingDownload"
          class="w-full h-[40px] flex justify-center items-center"
          @click="downloadImgAvatar()"
        >
          <div class="flex flex-row items-center gap-2">
            <img
              src="@/assets/icons/ai-art/icon-download-mb.svg"
              alt=""
            />
            <span>{{ $t('common.download') }}</span>
          </div>
        </a-button>
        <a-button
          type="primary"
          :disabled="states.loadingUpAvatar"
          :loading="states.loadingUpAvatar"
          class="w-full h-[40px] flex justify-center items-center"
          @click="updateAvatar()"
        >
          <div class="flex flex-row items-center gap-2">
            <img
              src="@/assets/icons/ai-art/icon-ai-avatar.svg"
              alt=""
            />
            <span>Đặt làm ảnh đại diện</span>
          </div>
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { storeToRefs } from 'pinia'
import { aiArtTrialStore } from '@/stores/ai-art-trial'
import { ART_AI, LIST_CONTENT_GEN_AVATAR, STATUS_RESPONSE, TYPE_GEN } from '@/helper/const-ai-art'
import { message } from 'ant-design-vue'
import { computed, reactive, watch } from 'vue'
import ButtonGenImg from '@/views/page/ai-art/component/ai-art-premium/ButtonGenImg.vue'
import { updateImage } from '@/api/user'
import {
  postInteractionsApi,
  midjourneyInteractionsApi,
  getInteractionsResultApi
} from '@/api/ai-art'
import { useI18n } from 'vue-i18n'
import { urlsToFiles } from '@/helper/ultil.js'
import IconButtonMagic from '@/assets/icons/ai-art/icon-input.svg'
import IconButtonMagicDisable from '@/assets/icons/ai-art/icon-input-disable.svg'
import { downloadImg } from '@/helper/ultil'
import router from '@/router'
export default {
  name: 'GenImage',
  components: { ButtonGenImg },
  setup() {
    const { t } = useI18n()
    const states = reactive({
      intervalCurrent: null,
      contentRender: '',
      idUpscale: '',
      imageResultAvatar: null,
      loadingDownload: false,
      loadingUpAvatar: false
    })
    const aiArtTrial = aiArtTrialStore()
    const { imageFile, imageUrl, loadingGenImage } = storeToRefs(aiArtTrial)
    const randomContentGenAvatar = () => {
      const indexRandom = Math.floor(Math.random() * LIST_CONTENT_GEN_AVATAR.length)
      return LIST_CONTENT_GEN_AVATAR[indexRandom]
    }

    const imageResultAvatar = computed(() => {
      return aiArtTrial.imageResultAvatar
    })

    const genImageUpScale = async () => {
      aiArtTrial.setIdCancelService(states.idUpscale)
      try {
        const intervalUpscale = setInterval(async () => {
          const resUpscale = await getInteractionsResultApi({ id: states.idUpscale })
          if (resUpscale?.data?.status === STATUS_RESPONSE.CANCEL) {
            clearInterval(intervalUpscale)
            message.error(t('ai-art.notication-error'))
            aiArtTrial.setLoadingGenImage(false)
          } else {
            if (resUpscale?.data?.responseImage) {
              clearInterval(intervalUpscale)
              aiArtTrial.setImageResultAvatar(resUpscale?.data?.responseImage)
              aiArtTrial.setLoadingGenImage(false)
            }
          }
        }, ART_AI.TIME_MESSAGE)
        states.intervalCurrent = intervalUpscale
      } catch (e) {
        console.log(e)
        message.error(t('ai-art.notication-error'))
        aiArtTrial.setLoadingGenImage(false)
      }
    }

    const genImageById = async (id) => {
      aiArtTrial.setIdCancelService(id)
      try {
        const intervalResult = setInterval(async () => {
          const resResult = await getInteractionsResultApi({ id })
          if (resResult?.data?.status === STATUS_RESPONSE.CANCEL) {
            message.error(t('ai-art.notication-error'))
            clearInterval(intervalResult)
            aiArtTrial.setLoadingGenImage(false)
          } else {
            if (resResult?.data?.responseImage) {
              clearInterval(intervalResult)
              const upscaleImage = {
                content: states.contentRender,
                imagePosition: Math.floor(Math.random() * 4) + 1,
                parentId: resResult.data.id,
                properties: [],
                type: ART_AI.TYPE.UPSCALE,
                tomiruType: TYPE_GEN.AVATAR
              }
              const resUpscale = await postInteractionsApi(upscaleImage)
              if (resUpscale.message === 'ok') {
                states.idUpscale = resUpscale?.data?.id
                await genImageUpScale()
              }
            }
          }
        }, ART_AI.TIME_MESSAGE)
        states.intervalCurrent = intervalResult
      } catch (e) {
        console.log(e)
        message.error(t('ai-art.notication-error'))
        aiArtTrial.setLoadingGenImage(false)
      }
    }
    const handleInteractionImage = async () => {
      aiArtTrial.setLoadingGenImage(true)
      states.contentRender = randomContentGenAvatar()
      const body_ = new FormData()
      body_.append('type', ART_AI.TYPE.DEFAULT)
      body_.append('aspectRatio', '1:1')
      body_.append('customImage', imageFile.value)
      body_.append('content', states.contentRender)
      body_.append('parentId', null)
      body_.append('imagePosition', null)
      body_.append('quality', '1')
      body_.append('tomiruType', TYPE_GEN.AVATAR)
      try {
        const res = await postInteractionsApi(body_)
        if (res.data?.id) {
          aiArtTrial.setIdGenImage(res.data?.id)
          await genImageById(res.data?.id)
        }
      } catch (err) {
        console.log(err)
        message.error(t('ai-art.notication-error'))
        aiArtTrial.setLoadingGenImage(false)
      }
    }

    const handleReGenInteractionImage = async (data) => {
      aiArtTrial.setLoadingGenImage(true)
      states.contentRender = randomContentGenAvatar()
      const body_ = {
        content: data.content,
        imagePosition: 1,
        parentId: data.id,
        properties: [],
        tomiruType: 'avatar',
        type: 2
      }
      try {
        const res = await postInteractionsApi(body_)
        if (res.data?.id) {
          aiArtTrial.setIdGenImage(res.data?.id)
          await genImageById(res.data?.id)
        }
      } catch (err) {
        console.log(err)
        message.error(t('ai-art.notication-error'))
        aiArtTrial.setLoadingGenImage(false)
      }
    }

    const downloadImgAvatar = async () => {
      states.loadingDownload = true
      try {
        await downloadImg(imageResultAvatar.value)
      } catch (e) {
        console.log(e)
      } finally {
        states.loadingDownload = false
      }
    }
    const updateAvatar = async () => {
      states.loadingUpAvatar = true
      try {
        const file = await urlsToFiles([imageResultAvatar.value])
        if (file.length) {
          const params = new FormData()
          params.append('profile', file[0])
          await updateImage(params)
          message.success('Đã thay đổi ảnh đại diện')
        }
      } catch (e) {
        console.log(e)
        message.error(e.message || 'Đã có lỗi xảy ra, hãy thử lại sau!')
      } finally {
        states.loadingUpAvatar = false
      }
    }

    const handleCancelGenImage = async () => {
      await midjourneyInteractionsApi({
        id: aiArtTrial.idCancelService
      })
      window.clearInterval(states.intervalCurrent)
      aiArtTrial.setLoadingGenImage(false)
    }

    watch(
      () => aiArtTrial.dataSourceReGender,
      async () => {
        if (aiArtTrial.dataSourceReGender) {
          await handleReGenInteractionImage(aiArtTrial.dataSourceReGender)
        }
        aiArtTrial.setDataSourceReGender(null)
      }
    )

    // watch(
    //   () => router.currentRoute.value.name,
    //   () => {
    //     handleCancelGenImage()
    //   }
    // )
    return {
      states,
      imageResultAvatar,
      IconButtonMagic,
      imageFile,
      loadingGenImage,
      downloadImgAvatar,
      imageUrl,
      IconButtonMagicDisable,
      handleCancelGenImage,
      handleInteractionImage,
      updateAvatar
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';
.gen-avatar-page {
  .gen-avatar-button-content {
    border: 1px dashed $primary-color;
  }

  .cursor-not-allowed {
    .gen-avatar-button-content {
      border: 1px dashed $neutral-500;
    }
  }

  .gen-avatar-page__loading {
    .loader {
      width: 54px;
      height: 54px;
      border: 7px solid #978f7c;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
  }

  .button-re-gen-image {
    &:hover {
      background: (0, 0, 0, 0.6);
    }
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes scaleMagic {
  0% {
    scale: 0.98;
  }

  25% {
    scale: 0.99;
  }

  50% {
    scale: 1;
  }

  75% {
    scale: 0.99;
  }
  100% {
    scale: 0.98;
  }
}
.btn-cancel-pending {
  border: 1px solid $color-warning-pending;

  span {
    color: $color-warning-pending;
  }
  @media only screen and (max-width: 639px) {
    margin-bottom: 0;
  }
}
</style>
