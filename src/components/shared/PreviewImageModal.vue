<template>
  <a-modal v-model:visible="isOpenModal"
           wrap-class-name="image-modal"
           centered
           width="auto"
           :footer="null"
           :after-close="handleModalClose">
    <div class="cs-h-screen flex flex-col items-center">
      <div class="image-modal-wrapper">
        <button v-if="imagesStore.length > 1"
                class="gi-btn gi-btn-prev"
                @click="prev">
          <LeftOutlined />
        </button>
        <button v-if="imagesStore.length > 1"
                class="gi-btn gi-btn-next"
                @click="next">
          <RightOutlined/>
        </button>
        <img :src="imageUrlStore" alt=""
             @click="isOpenModal = false">
      </div>
      <div v-if="imagesStore && imagesStore.length && imagesStore.length > 1"
           class="flex items-center gap-4 lg:h-32 h-24 px-4 pb-4 ">
        <img v-for="(url, index) in imagesStore"
             :key="index"
             :src="url" alt=""
             :class="url === imageUrlStore ? '' : 'grayscale'"
             class="h-full md:w-24 bg-white cursor-pointer rounded-lg max-md:flex-1 min-w-0 object-cover"
             @click="handleClickImage(url, index)">
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import {computed, ref, watch} from "vue";
import {useImageStore} from "@/stores/image";
import {RightOutlined, LeftOutlined} from "@ant-design/icons-vue";

const isOpenModal = ref(false)
const store = useImageStore()
const selectedIndex = ref(0);

const isOpenModalStore = computed(() => {
  return store.isOpenImageModal;
})

const imageUrlStore = computed(() => {
  return store.previewImageUrl;
})

const imagesStore = computed(() => {
  return store.images;
})

const handleClickImage = (url, index) => {
  store.setImage(url)
  selectedIndex.value = index;
}

const handleKeydown = (event) => {
  if (imagesStore.value && imagesStore.value.length) {
    // right
    if (event.keyCode === 39) {
      show(selectedIndex.value + 1)
    }
    // left
    if (event.keyCode === 37) {
      show(selectedIndex.value - 1)
    }
  }
}

watch(isOpenModalStore, () => {
  if (isOpenModalStore.value) {
    isOpenModal.value = true;
    if (imagesStore.value && imagesStore.value.length) {
      selectedIndex.value = imagesStore.value.findIndex(url => url === imageUrlStore.value)
      window.addEventListener('keydown', handleKeydown)
    }
  } else {
    // isOpenModal.value = false;
  }
})

const handleModalClose = () => {
  store.closeModal()
  selectedIndex.value = 0
  window.removeEventListener('keydown', handleKeydown)
}

const show = (i) => {
  if (i >= imagesStore.value.length) {
    i = 0;
  }
  if (i < 0) {
    i = imagesStore.value.length - 1;
  }
  selectedIndex.value = i;
  store.setImage(imagesStore.value[selectedIndex.value])
}

const next = () => {
  show(selectedIndex.value + 1)
}

const prev = () => {
  show(selectedIndex.value - 1)
}


const open = () => {
  isOpenModal.value = true;
}
defineExpose({
  open
});
</script>

<style lang="scss">
.image-modal {
  .ant-modal-content {
    background: transparent;
    box-shadow: none;
    border: 0;
  }
  &.ant-modal-wrap {
    padding: 0;
  }
  .ant-modal-close {
    position: fixed;
  }
  .ant-modal-body {
    width: 100%;
    height: 100vh;
    padding: 0;
  }
  .ant-modal-close-x {
    position: fixed;
    top: 1px;
    right: 20px;
  }
  .ant-modal {
    margin: auto;
  }
}
.border-active {
  border: 2px solid var(--bg-primary-color);
}
.image-modal-wrapper {
  //height: 100%;
  display: flex;
  align-items: center;
  padding: 1rem;
  flex: 1;
  min-height: 1px;
  position: relative;
  img {
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
    object-fit: contain;
    border-radius: 8px;
  }
  .gi-btn {
    padding: 9px 6px;
    transition: .25s;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 999;
    top: 50%;
    transform: translateY(-50%);
  }
  .gi-btn:hover {
    background: #E8D6A1;
    color: #000;
  }
  .gi-btn-prev {
    left: 15px;
  }
  .gi-btn-next {
    right: 15px;
  }
  @media (max-width: 1024px) {
    .gi-btn {
      background: #E8D6A1;
      color: #000;
    }
  }
}
</style>