<template>
  <div class="tab-kyc flex flex-col gap-8">
    <a-button
      type="back"
      v-if="router.currentRoute.value.name === 'kyc'"
      class="w-fit"
      @click="handleBackRoute"
    >
      {{ $t('common.back') }}
    </a-button>
    <p class="text-body-1 !font-bold text-gold-150 text-center">
      {{ $t('register.set_kyc_title') }}
    </p>
    <UploadImage @upload:base64="fetchImage"></UploadImage>
    <a-button
      :disabled="states.loading"
      :loading="states.loading"
      class="w-full"
      type="primary-shadow"
      @click="uploadImage"
      >{{ $t('common.verify') }}
    </a-button>

    <a-modal
      centered
      wrap-class-name="modal-kyc"
      v-model:visible="states.showLiveKyc"
      @afterClose="location.reload()"
    >
      <iframe
        class="w-full h-full"
        :src="states.liveKycLink"
        allow="camera"
      ></iframe>
    </a-modal>
  </div>
</template>
<script>
import UploadImage from '@/components/app/UploadImage.vue'
import { uploadImageKyc, resetKycApi, kycGenLiveApi } from '@/api/auth'
import { onMounted, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import { userStore } from '@/stores/userStore'
import router from '@/router'

export default {
  name: 'KycComponent',
  components: {
    UploadImage
  },
  setup() {
    const states = reactive({
      imageFile: '',
      showLiveKyc: false,
      liveKycLink: '',
      loading: false
    })

    const fetchImage = (image) => {
      states.imageFile = image.imageFile
    }
    const uploadImage = async () => {
      try {
        states.loading = true
        const formData = new FormData()
        formData.append('file', states.imageFile)
        await resetKycApi()
        await uploadImageKyc(formData)
        await kycGenLive()
      } catch (e) {
        message.error(e.message)
      } finally {
        states.loading = false
      }
    }
    const kycGenLive = async () => {
      try {
        const { data } = await kycGenLiveApi()
        states.liveKycLink = data.data.link
        states.showLiveKyc = true
      } catch (e) {
        if (e.message.includes('Too Many Requests')) {
          message.error('Đã yêu cầu xác minh quá nhiều lần, xin hãy thử lại sau!')
        } else {
          message.error(e.message)
        }
      }
    }

    const onLoadLiveKyc = (frame) => {
      console.log(frame.contentWindow)
    }

    const checkKyc = () => {
      if (userStore().userInfo.kycStatus === 'approved') {
        router.push({
          name: 'profile'
        })
      }
    }

    const handleBackRoute = () => {
      router.back()
    }
    watch(
      () => states.showLiveKyc,
      async () => {
        if (!states.showLiveKyc) {
          await userStore().getUserInfo()
          checkKyc()
        }
      }
    )
    return { fetchImage, router, uploadImage, states, handleBackRoute, onLoadLiveKyc }
  }
}
</script>
