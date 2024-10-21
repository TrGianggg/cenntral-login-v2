<template>
  <div class="page-club w-full flex max-w-[1920px]">
    <div
      class="mx-auto w-full flex flex-col items-center"
      :class="{ 'gap-5': tabActive !== 'ListPost' }"
    >
      <div class="w-full bg-neutral-850 flex flex-col justify-between items-center">
        <div class="w-full max-w-[1240px] flex flex-col justify-between items-center">
          <div class="h-fit w-full">
            <CoverImage
              :src="userInfo.coverImage"
              :src-full="userInfo.coverImageFull"
            />
            <div class="w-full translate-y-[-25%] md:translate-y-[-50%] flex">
              <div
                class="w-[95%] md:w-[92%] mx-auto md:mr-0 flex flex-col md:flex-row justify-between md:items-end items-start gap-8 px-3"
              >
                <div class="flex flex-row items-end gap-[44px]">
                  <ProfileAvatar
                    :src="userInfo.profileImage"
                    :src-full="userInfo.profileImageFull"
                  />
                  <div class="flex flex-col">
                    <div class="flex flex-row items-center gap-2">
                      <p class="text-gold-150 text-heading-3">
                        {{ userInfo.firstName }} {{ userInfo.lastName }}
                      </p>
                      <div
                        v-if="userInfo.kycStatus === 'approved'"
                        class="w-6 h-6 rounded-full flex bg-green-500"
                      >
                        <CheckOutlined class="m-auto !text-white" />
                      </div>
                    </div>
                    <p class="text-neutral-400">{{ userInfo.username }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div class="flex flex-row gap-4">
                    <a-button
                      type="primary"
                      v-if="!(userInfo.kycStatus === 'approved')"
                      @click="getRecognitionFace"
                    >
                      Xác minh người dùng
                    </a-button>
                  </div>
                  <AppUserInfo :hideInfo="true"></AppUserInfo>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row select-none">
            <div
              v-for="tab in listTab"
              :key="tab.value"
              :class="[
                'px-4 md:px-8 cursor-pointer !font-bold py-4',
                tabActive === tab.value
                  ? 'border-b-4 border-solid border-gold-150 text-gold-150'
                  : ''
              ]"
              @click="handleSelectTab(tab.value)"
            >
              <span class="text-body-3">{{ tab.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <keep-alive>
          <component :is="tabActive"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import { CheckOutlined, CameraFilled } from '@ant-design/icons-vue'
import { userStore } from '@/stores/userStore'
import { computed, onMounted, reactive, ref } from 'vue'
import { logOut } from '@/helper'
import router from '@/router'
import MyRefCode from '@/views/page/profile/components/MyRefCode.vue'
import ListPost from '@/views/page/profile/components/ListPost.vue'
import IconChangePassword from '@/components/shared/icons/IconChangePassword.vue'
import IconLogout from '@/components/shared/icons/IconLogout.vue'
import AppUserInfo from '@/components/app/AppUserInfo.vue'
import ProfileAvatar from '@/views/page/profile/components/ProfileAvatar.vue'
import CoverImage from '@/views/page/profile/components/CoverImage.vue'
import ListFriend from '@/views/page/profile/components/ListFriendTab.vue'
import { useAppStore } from '@/stores/appStore'
import { useI18n } from 'vue-i18n'
import { updateImage } from '@/api/user'

export default {
  name: 'PageHome',
  components: {
    IconLogout,
    IconChangePassword,
    CheckOutlined,
    MyRefCode,
    AppUserInfo,
    ListPost,
    CameraFilled,
    ProfileAvatar,
    CoverImage,
    ListFriend
  },
  setup() {
    const { t } = useI18n()
    const states = reactive({
      loading: false
    })
    const userInfo = computed(() => {
      return userStore().userInfo
    })
    const tabActive = ref('ListPost')
    const listTab = [
      {
        value: 'ListPost',
        label: 'Bài viết'
      },
      {
        value: 'ListFriend',
        label: 'Bạn bè'
      },
      {
        value: 'intro',
        label: 'Giới thiệu'
      },
      {
        value: 'MyRefCode',
        label: 'Mã giới thiệu'
      }
    ]
    const handleSelectTab = (tab) => {
      tabActive.value = tab
    }

    const getRecognitionFace = async () => {
      router.push({
        name: 'kyc'
      })
    }
    const setDataBreadCrumb = () => {
      const data = [
        {
          label: t('layout.menu_main.home'),
          link: '/'
        },
        {
          label: t('common.profile')
        }
      ]
      useAppStore().setDataBreadCrumb(data)
    }
    onMounted(() => {
      setDataBreadCrumb()
    })
    return {
      states,
      userInfo,
      listTab,
      tabActive,
      handleSelectTab,
      logOut,
      getRecognitionFace
    }
  },

  methods: {
    onCoverChange(event) {
      const file = event.target.files[0]
      const formData = new FormData()
      formData.append('profile', file)
      updateImage(formData)
    }
  }
}
</script>
