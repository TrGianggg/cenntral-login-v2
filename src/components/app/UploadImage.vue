<template>
  <Upload
    v-model:file-list="fileList"
    name="image"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    accept=".png,.jpg"
    :customRequest="handleGetFile"
    :before-upload="beforeUpload"
  >
    <div
      v-if="fileBase64"
      class="h-full w-full relative"
    >
      <img
        class="object-contain w-full h-full"
        :src="fileBase64"
        alt="avatar"
      />
      <div
        class="absolute w-full h-full hover:opacity-70 top-0 bg-gray-900 flex opacity-0 transition-500"
      >
        <div class="flex flex-col gap-4 m-auto">
          <PlusOutlined class="text-gold-150 text-4xl" />
          <span class="text-body-1 text-gold-150">{{ $t('register.change_image') }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <loading-outlined v-if="loading" />
      <div class="flex flex-col gap-4">
        <PlusOutlined class="text-gold-150 text-4xl" />
        <p class="text-body-1 text-gold-150">{{ $t('common.upload_image') }}</p>
      </div>
    </div>
  </Upload>
</template>
<script>
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { Upload } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default defineComponent({
  name: 'UploadComp',
  components: {
    LoadingOutlined,
    PlusOutlined,
    Upload
  },
  emits: ['upload:base64'],
  setup(_, { emit }) {
    const { t } = useI18n()
    const fileList = ref([])
    const fileBase64 = ref('')
    const loading = ref(false)
    const imageUrl = ref('')
    const beforeUpload = (file) => {
      const isJpgOrPng = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg'].includes(file.type)
      if (!isJpgOrPng) {
        message.error(t('common.validate.type_image'))
      }
      const isLt5M = file.size / 1024 / 1024 < 10
      if (!isLt5M) {
        message.error(t('common.validate.type_image'))
      }
      return isJpgOrPng && isLt5M
    }

    const handleGetFile = (file) => {
      getBase64(file.file, (result) => {
        fileBase64.value = result
        const params = {
          imageDisplay: fileBase64.value,
          imageFile: fileList.value[0].originFileObj
        }
        emit('upload:base64', params)
      })
    }
    return {
      fileList,
      loading,
      imageUrl,
      fileBase64,
      beforeUpload,
      handleGetFile
    }
  }
})
</script>
<style lang="scss">
.avatar-uploader > .ant-upload {
  width: 100%;
  height: 400px;
  max-width: 400px;
  border-radius: 16px;
  overflow: hidden;
  background: #1a1a1a;
}

.light-theme {
  .avatar-uploader > .ant-upload {
    background: var(--neutral-850-2);
  }
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
