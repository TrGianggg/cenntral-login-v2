<template>
  <div class="relative bg-neutral-200 md:h-[401px] h-[200px]">
    <img v-if="userInfo && userInfo.email"
         class="h-full w-full object-cover"
         :src="previewUrl || src || '/default-cover.png'"
         alt="cover"
         @click="openPreviewModal"
    />
    <div v-else
         class="h-full w-full object-cover bg-neutral-200">
    </div>
    <div class="absolute right-3 bottom-3 z-40">
      <label v-if="isUpdate"
             for="coverImage"
             class="cursor-pointer text-white change-cover-icon">
        <CameraFilled class="text-[20px]" />
        <span class="md:block hidden">Chỉnh sửa ảnh bìa</span>
      </label>
      <input type="file"
             class="hidden"
             accept=".png, .jpg, .jpeg"
             id="coverImage"
             @change="onCoverChange">
    </div>
  </div>
</template>
<script setup>
import {CameraFilled} from "@ant-design/icons-vue";
import {updateImage} from "@/api/user";
import {computed, ref, toRefs, watch} from "vue";
import {userStore} from "@/stores/userStore";
import {getFileExtension} from "@/helper/ultil";
import { SUPPORTED_EXTENSIONS_PROFILE} from "@/helper/const";
import {message} from "ant-design-vue";
import {useImageStore} from "@/stores/image";

const previewUrl = ref('');

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  srcFull: {
    type: String,
    default: ''
  },
  isUpdate: {
    type: Boolean,
    default: true
  },
  userInfo: {
    type: Object,
    default() {
      return null
    }
  }
})
const { src, srcFull } = toRefs(props)


const store = useImageStore()

const onCoverChange = (event) => {
  const file = event.target.files[0];
  const MAX_FILE_SIZE_IN_MB = 5;
  const fileSize = file.size / 1024 / 1024;
  const fileExtension = getFileExtension(file.name)
  const allowExtensions = SUPPORTED_EXTENSIONS_PROFILE
  if (fileSize > MAX_FILE_SIZE_IN_MB) {
    return message.info(`Ảnh không được có dung lượng quá ${MAX_FILE_SIZE_IN_MB}MB`)
  }
  if (!allowExtensions.includes(fileExtension)) {
    return message.info(`Ảnh không đúng định dạng`)
  }
  const formData = new FormData();
  formData.append('cover', file);
  updateImage(formData)
  previewUrl.value = URL.createObjectURL(file);
}

const openPreviewModal = () => {
  store.openModal(previewUrl.value || srcFull.value || '/default-cover.png')
}
</script>

<style lang="scss" scoped>
.change-cover-icon {
  background: rgba(0,0,0,0.4);
  color: white;
  padding: 6px 8px;
  display: flex;
  border-radius: 4px;
  gap: 4px;
  font-weight: 700;
  &:hover {
    background: rgba(0,0,0,0.7);
  }
}
</style>