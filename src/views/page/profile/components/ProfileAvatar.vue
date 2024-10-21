<template>
  <div class="relative w-max">
    <div
        class="w-[80px] h-[80px] md:h-[160px] md:w-[160px] rounded-full border overflow-hidden border-solid border-neutral-900"
    >
      <img v-if="userInfo && userInfo.email"
           :src="previewUrl || src || '/default-avatar.png'"
           class="object-cover h-full w-full bg-white cursor-pointer"
           alt="avatar"
           @click="viewImage"
      />
      <div v-else
           class="h-full w-full bg-white cursor-pointer"
      />
      <label v-if="isUpdate"
             for="profileImage"
             class="cursor-pointer absolute bottom-3 md:text-[20px] text-[12px] right-1 z-40 change-avatar-con">
        <CameraFilled />
      </label>
      <input type="file"
             class="hidden"
             accept=".png, .jpg, .jpeg"
             id="profileImage"
             @change="onAvatarChange">
    </div>
  </div>
</template>

<script setup>
import {CameraFilled} from "@ant-design/icons-vue";
import {computed, ref, toRefs} from "vue";
import {userStore} from "@/stores/userStore";
import {updateImage} from "@/api/user";
import {getFileExtension} from "@/helper/ultil";
import { message } from 'ant-design-vue'
import {SUPPORTED_EXTENSIONS_PROFILE} from "@/helper/const";
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
const { srcFull } = toRefs(props)
const imageStore = useImageStore()

const userInfoStore = computed(() => {
  return userStore().userInfo
})

const onAvatarChange = (event) => {
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
  formData.append('profile', file);
  updateImage(formData)
  previewUrl.value = URL.createObjectURL(file);
  userStore().setUserInfo({
    ...userInfoStore.value,
    profileImage: previewUrl
  })
}

const viewImage = () => {
  imageStore.openModal(previewUrl.value || srcFull.value || '/default-avatar.png')
}

</script>

<style lang="scss" scoped>
.change-avatar-con {
  background: #dadada;
  color: var(--color-white);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  &:hover {
    background: #b0b0b0;
  }
}
.dark-theme {
  .change-avatar-con {
    background: #454545;
    &:hover {
      background: #2c2c2c;
    }
  }
}

@media (max-width: 768px) {
  .change-avatar-con {
    width: 20px;
    height: 20px;
    right: 0;
    bottom: 4px;
  }
}
</style>