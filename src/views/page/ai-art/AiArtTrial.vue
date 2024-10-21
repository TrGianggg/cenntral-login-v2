<template>
  <div class="ai-art-trial w-full min-h-screen gap-3 grid grid-cols-12 p-6">
    <div
      class="ai-art-trial-container col-span-12 lg:col-span-8 flex flex-col mt-6 md:mt-12 xl:mt-0 mx-auto rounded-lg p-3 md:p-4 xl:p-6"
    >
      <div class="ai-art-trial-input-image flex flex-col md:flex-row py-3 gap-4">
        <div
          class="border-[1px] w-full min-h-[116px] relative max-w-[222px] overflow-hidden border-dashed rounded-lg border-neutral-600 flex"
        >
          <UploadImage class="select-none m-auto"></UploadImage>
          <div
            v-if="loadingGenImage"
            class="absolute w-full h-full top-0 cursor-not-allowed bg-[rgba(0,0,0,0.7)]"
          ></div>
        </div>
        <div class="flex flex-col items-end gap-4">
          <div class="flex flex-col gap-3">
            <p class="text-heading-4 text-gold-150">
              Trình tạo ảnh đại diện theo phong cách riêng của bạn
            </p>
            <p class="text-body-4">
              Hiện đại hóa hình ảnh của bạn chưa bao giờ dễ dàng đến vậy! Bằng cách sử dụng trí tuệ
              nhân tạo, bạn có thể tạo ra một avatar độc đáo và chân thực như chính bản thân bạn.
            </p>
          </div>
          <a
            class="underline lg:hidden underline-offset-2 hover:underline text-body-3"
            @click="() => (openDrawer = true)"
            >Xem lịch sử</a
          >
        </div>
      </div>
      <div class="ai-art-trial-render w-full h-full py-6">
        <GenAvatar></GenAvatar>
      </div>
    </div>
    <div class="col-span-4 history-container hidden lg:flex flex-col">
      <div class="py-4 border-b">
        <p class="text-heading-4">Lịch sử tạo ảnh</p>
      </div>
      <div
        class="sticky ai-art-trial-history top-0 w-full px-3 overflow-hidden rounded-lg overflow-y-visible md:mt-12 xl:mt-0"
      >
        <ListHistoryGenAvatar></ListHistoryGenAvatar>
      </div>
    </div>
    <a-drawer
      class="drawer-history-avatar lg:hidden"
      placement="right"
      width="80%"
      title="Lịch sử tạo ảnh"
      v-model:visible="openDrawer"
    >
      <ListHistoryGenAvatar @closeHistory="(event) => (openDrawer = event)"></ListHistoryGenAvatar>
    </a-drawer>
  </div>
</template>
<script>
import { userStore } from '@/stores/userStore'
import { computed, onMounted, ref } from 'vue'
import useDestroyed from 'ant-design-vue/es/_util/hooks/useDestroyed'
import { storeToRefs } from 'pinia'
import { masterDataStore } from '@/stores/masterDataStore'
import { aiArtTrialStore } from '@/stores/ai-art-trial'
import UploadImage from '@/views/page/ai-art/component/ai-art-trial/UploadImage.vue'
import GenAvatar from '@/views/page/ai-art/component/ai-art-trial/GenAvatar.vue'
import ListHistoryGenAvatar from '@/views/page/ai-art/component/ai-art-trial/ListHIstoryGenAvatar.vue'
export default {
  name: 'LayoutContent',

  components: { UploadImage, GenAvatar, ListHistoryGenAvatar },
  setup() {
    const { loadingGenImage } = storeToRefs(aiArtTrialStore())
    onMounted(async () => {
      await masterDataStore().getMasterData()
    })
    const userInfo = computed(() => {
      return userStore().userInfo
    })

    const openDrawer = ref(false)

    return {
      loadingGenImage,
      openDrawer,
      userInfo
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';
.ai-art-trial-input-image {
  border-bottom: 1px solid $neutral-700;
  padding-bottom: 24px;
}

.ai-art-trial-container {
  background: #f0f2f5;
}

.ai-art-trial-history {
  height: calc(100vh - 150px);
}
.history-container {
  background: #f7f7f7;
  border-radius: 8px;
  padding: 16px;
}
.dark-theme {
  .ai-art-trial-container,
  .ai-art-trial-history,
  .history-container {
    background: #1a1a1a;
  }
}

.drawer-history-avatar {
  .ant-drawer-body {
    padding: 0;
  }
  .ant-drawer-close {
    position: absolute;
    font-size: 24px;
    left: 12px;
  }
  .ant-drawer-title {
    font-size: 24px;
    font-weight: 700;
    display: flex;
    justify-content: center;
  }
}

.dark-theme {
  .drawer-history-avatar {
    .ant-drawer-title,
    .ant-drawer-close {
      color: $gold-150;
    }
  }
}

@media screen and (max-width: 1024px) {
  .ai-art-trial-history {
    height: calc(100vh - 96px);
  }
}
</style>
