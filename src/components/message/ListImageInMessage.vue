<template>
  <div v-if="images && images.length"
       class="ssm1:w-[292px] w-[230px] flex flex-wrap">
    <div v-for="(url, index) in images"
         :key="index"
         class="image-wrapper"
         :class="getFlexBasic(index)"
         @click="viewImage(url)">
      <img :src="url" alt="">
    </div>
  </div>
</template>

<script setup>
import {useImageStore} from "@/stores/image";
import {toRefs} from "vue";

const props = defineProps({
  images: {
    type: Array,
    default() {
      return []
    }
  }
})

const { images } = toRefs(props)

const imageStore = useImageStore()
const viewImage = (url) => {
  imageStore.openModal(url)
  imageStore.setImages(images.value)
}

const getFlexBasic = (index) => {
  if (images.value && images.value.length > 4) {
    return index > 1 ? 'basis-1/3' : 'basis-1/2'
  }
  if (images.value && (images.value.length === 4 || images.value.length === 2)) {
    return 'basis-1/2'
  }
  return 'basis-1/3'
}
</script>

<style scoped lang="scss">
.image-wrapper {
  position: relative;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    padding: 2px;
    border-radius: 8px;
    cursor: pointer;
  }
}
</style>