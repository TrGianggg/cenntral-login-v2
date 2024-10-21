<template>
  <div
    v-if="states.dataHistory.length"
    class="comp-avatar-history py-6 px-3 lg:px-0 gap-4 flex flex-col items-center"
  >
    <div
      v-for="item in states.dataHistory"
      :key="item.id"
      class="item-history flex flex-col gap-6 p-3 py-6 rounded-lg"
    >
      <div class="item-history__gender flex flex-col gap-4 items-center">
        <div class="w-full">
          <div class="p-3 w-fit rounded-2xl border border-dashed">
            <p class="text-body-3 font-bold">Ảnh đại diện đã được tạo</p>
          </div>
        </div>
        <div class="w-[90%] rounded-lg flex overflow-hidden aspect-[3/2]">
          <a-image
            class="w-full"
            :src="item.imageRender"
          >
            <template #placeholder>
              <img
                class="object-contain mx-auto rounded-lg"
                :src="item.imageRender"
                alt
              />
            </template>
            <template #previewMask>
              <EyeOutlined class="text-3xl"></EyeOutlined>
            </template>
          </a-image>
        </div>
        <div class="flex flex-col gap-3">
          <a-button
            :loading="states.loadingUpAvatar && states.idSelect === item.id"
            type="primary"
            class="!px-4 md:!px-6 !h-[32px] !rounded-lg"
            @click="handleReupAvatar(item)"
          >
            Đặt làm ảnh đại diện
          </a-button>
          <a-button
            :loading="states.loadingDownload && states.idSelect === item.id"
            type="primary"
            class="!px-4 md:!px-6 !h-[32px] !rounded-lg"
            @click="handleDownloadImage(item)"
            >Tải xuống</a-button
          >
          <a-button
            class="!px-4 md:!px-6 !h-[32px] !rounded-lg"
            :disabled="aiArtTrial.loadingGenImage"
            @click="handleReGenAvatar(item)"
            type="primary"
            >Tạo lại avatar</a-button
          >
        </div>
      </div>
    </div>
    <div class="pb-6">
      <a
        v-if="!states.loading && states.cursorAfter"
        class="underline underline-offset-2 select-none hover:underline"
        @click="handleLoadMore"
        >Xem thêm</a
      >
      <LoadingOutlined
        v-if="states.loading"
        class="text-2xl"
      />
    </div>
  </div>
  <div
    v-else
    class="w-full h-full flex"
  >
    <div class="m-auto">
      <a-empty :description="'Chưa có dữ liệu lịch sử'" />
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, defineEmits, watch } from 'vue'
import { getInteractionsApi } from '@/api/ai-art'
import { LoadingOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { aiArtTrialStore } from '@/stores/ai-art-trial'
import { downloadImg, urlsToFiles } from '@/helper/ultil'
import { updateImage } from '@/api/user'
import { message } from 'ant-design-vue'

const emit = defineEmits(['closeHistory'])

const states = reactive({
  dataHistory: [],
  loading: false,
  limit: 5,
  idSelect: '',
  loadingUpAvatar: false,
  cursorAfter: null,
  loadingDownload: false
})

const aiArtTrial = aiArtTrialStore()

const initGetInteractions = async () => {
  states.loading = true
  const params = {
    limit: states.limit,
    after: states.cursorAfter,
    filters: {
      type: 'avatar'
    }
  }
  try {
    const { data: res } = await getInteractionsApi(params)
    if (res.data) {
      const dataResult = [
        ...res.data?.map((item) => {
          return {
            ...item,
            imageRender: item.responseImage
          }
        })
      ]
      states.dataHistory = states.dataHistory.concat(dataResult)
      states.cursorAfter = res.cursor.afterCursor
    }
  } catch (e) {
    console.log(e)
  } finally {
    states.loading = false
  }
}

const handleLoadMore = () => {
  initGetInteractions()
}

const handleDownloadImage = async (item) => {
  states.idSelect = item.id
  states.loadingDownload = true
  try {
    await downloadImg(item.imageRender)
  } catch (e) {
    console.log(e)
  } finally {
    states.loadingDownload = false
  }
}

const handleReupAvatar = async (item) => {
  states.idSelect = item.id
  states.loadingUpAvatar = true
  try {
    const file = await urlsToFiles([item.imageRender])
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

const handleReGenAvatar = async (data) => {
  aiArtTrial.setDataSourceReGender(data)
  aiArtTrial.setImageFile(null)
  aiArtTrial.setImageUrl(null)
  emit('closeHistory', false)
}
watch(
  () => aiArtTrial.imageResultAvatar,
  async () => {
    if (aiArtTrial.imageResultAvatar) {
      states.cursorAfter = null
      states.dataHistory = []
      await initGetInteractions()
    }
  }
)

onMounted(() => {
  initGetInteractions()
})
</script>
<style lang="scss">
@import '@/design/base.scss';
.comp-avatar-history {
  height: 100%;
  .item-history {
    width: 100%;
    background: #e7e7e8;
  }
}

.dark-theme {
  .comp-avatar-history {
    .item-history {
      background: #2b2b2b;
    }
  }
}
</style>
