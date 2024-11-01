<template>
  <div class="page-club w-full flex max-w-[1920px]">
    <div
      class="mx-auto w-full flex flex-col items-center"
      :class="{ 'gap-5': tabActive !== 'refCode' }"
    >
      <div class="w-full bg-neutral-850 flex flex-col justify-between items-center">
        <div class="w-full max-w-[1240px] flex flex-col justify-between items-center">
          <div class="h-fit w-full profile-info-content">
            <CoverImage
              :src="userInfo.coverImage"
              :src-full="userInfo.coverImageFull"
              :user-info="userInfo"
              :is-update="isMe"
            />
            <div class="w-full translate-y-[-44px] md:translate-y-[-50%] flex">
              <div
                class="w-[95%] md:w-[92%] mx-auto md:mr-0 flex flex-col md:flex-row justify-between md:items-end items-start md:gap-8 gap-4 px-3"
              >
                <div
                  class="flex md:flex-row flex-col md:items-end md:gap-[44px] gap-4 max-md:w-full"
                >
                  <ProfileAvatar
                    :src="userInfo.profileImage"
                    :is-update="isMe"
                    :user-info="userInfo"
                    :src-full="userInfo.profileImageFull"
                  />
                  <div class="flex-1 min-w-0 flex justify-between">
                    <div class="flex flex-col">
                      <div class="flex flex-row items-center gap-2">
                        <p class="text-primary-color text-heading-3">
                          {{ userInfo.firstName }} {{ userInfo.lastName }}
                        </p>
                        <div
                          v-if="userInfo.kycStatus === 'approved'"
                          class="w-6 h-6 rounded-full"
                        >
                          <img
                            src="@/assets/icons/verify.png"
                            alt=""
                          />
                        </div>
                      </div>
                      <p class="text-neutral-400">@{{ userInfo.username }}</p>
                    </div>
                    <AppUserInfo
                      v-if="isMe"
                      class="md:hidden block"
                      :hideInfo="true"
                    ></AppUserInfo>
                  </div>
                </div>
                <div
                  v-if="userInfo && userInfo.email"
                  class="flex items-center gap-4"
                >
                  <a-button
                    type="primary"
                    v-if="!(userInfo.kycStatus === 'approved') && isMe"
                    class="!h-9 !px-5 md:mb-0 mb-6"
                    @click="getRecognitionFace"
                  >
                    Xác minh người dùng
                  </a-button>
                  <ButtonUserActions
                    :user-info="userInfo"
                    @on-add-friend="addFriend"
                  />
                  <AppUserInfo
                    v-if="isMe"
                    class="md:block hidden"
                    :hideInfo="true"
                  ></AppUserInfo>
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex flex-row select-none md:mt-0 -mt-12 md:w-max w-full px-4 tab-profile-wrapper"
          >
            <div
              v-for="tab in listTab"
              :key="tab.value"
              :class="[
                'px-3 md:px-8 cursor-pointer !font-bold py-4',
                tabActive === tab.value
                  ? 'border-b-2 border-solid border-gold-150-1 text-gold-150-1'
                  : ''
              ]"
              @click="handleSelectTab(tab.value)"
            >
              <span class="text-body-3">
                <span class="font-bold">{{ tab.label }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-center max-w-[650px]">
        <MyRefCode
          v-if="tabActive === 'refCode'"
          :is-visible="isModalVisible"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { CheckOutlined, CameraFilled } from '@ant-design/icons-vue'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { logOut, scrollToTop } from '@/helper'
import MyRefCode from '@/views/page/profile/components/MyRefCode.vue'
import ListFriendTab from '@/views/page/profile/components/ListFriendTab.vue'
import ListPost from '@/views/page/profile/components/ListPost.vue'
import IconChangePassword from '@/components/shared/icons/IconChangePassword.vue'
import IconLogout from '@/components/shared/icons/IconLogout.vue'
import AppUserInfo from '@/components/app/AppUserInfo.vue'
import ProfileAvatar from '@/views/page/profile/components/ProfileAvatar.vue'
import CoverImage from '@/views/page/profile/components/CoverImage.vue'
import UserIntroduce from '@/views/page/profile/components/UserIntroduce.vue'
import AddFriendIcon from '@/components/shared/icons/AddFriendIcon.vue'
import { useAppStore } from '@/stores/appStore'
import { useI18n } from 'vue-i18n'
import { getUserDetailApi } from '@/api/user'
import { useRoute } from 'vue-router'
import { getFullNameUser } from '@/helper/ultil'
import router from '@/router'
import { userStore } from '@/stores/userStore'
import ButtonUserActions from '@/views/page/profile/components/ButtonUserActions.vue'
import { useUserProfile } from '@/components/hooks/useUserProfile'
import { KEY_SUPPORT, supportStore } from '@/stores/support'

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
    ListFriendTab,
    UserIntroduce,
    AddFriendIcon,
    ButtonUserActions
  },
  setup() {
    const { t } = useI18n()
    const { isMe } = useUserProfile()
    const isModalVisible = ref(false)
    const tabActive = ref('refCode')
    onMounted(() => {
      isModalVisible.value = true
      supportStore().setKey(KEY_SUPPORT.REFCODE); 
    })
    const refresh = computed(() => {
      return userStore().refresh
    })
    const states = reactive({
      loading: false
    })
    const userInfo = ref({})
    const route = useRoute()

    const listTab = computed(() => {
      let tabs = [
        {
          value: 'refCode',
          label: 'Mã giới thiệu'
        }
      ]

      if (!isMe.value) {
        tabs = tabs.filter((o) => o.value !== 'refCode')
      }
      return tabs
    })
    const handleSelectTab = (tab) => {
      tabActive.value = tab
      if (tab === 'refCode') {
        supportStore().setKey(KEY_SUPPORT.REFCODE)
      }
    }

    const getRecognitionFace = async () => {
      router.push({
        name: 'kyc'
      })
    }

    const fetchUserDetail = () => {
      const username = route.params.username
      getUserDetailApi(username).then((resp) => {
        userInfo.value = resp.data
      })
    }
    watch(
      route,
      () => {
        nextTick(() => {
          scrollToTop()
        })
        fetchUserDetail()
      },
      { immediate: true, deep: true }
    )

    watch(tabActive, () => {
      nextTick(() => {
        scrollToTop()
      })
    })

    watch(
      () => refresh.value,
      () => {
        fetchUserDetail()
      }
    )

    const addFriend = () => {
      userInfo.value.statusFriend = 'pending'
    }

    watch(
      userInfo,
      (user) => {
        if (user && user.email) {
          const data = [
            {
              label: t('layout.menu_main.home'),
              link: '/'
            },
            {
              label: getFullNameUser(user)
            }
          ]
          useAppStore().setDataBreadCrumb(data)
        }
      },
      { immediate: true }
    )
    return {
      states,
      userInfo,
      listTab,
      tabActive,
      handleSelectTab,
      logOut,
      addFriend,
      getRecognitionFace,
      isMe
    }
  },

  methods: {}
}
</script>

<style lang="scss">
.profile-info-content {
  border-bottom: 1px solid #a1a1a1;
}
.dark-theme {
  .profile-info-content {
    border-bottom: 0;
  }
}
@media (max-width: 768px) {
  .profile-info-content {
    border-bottom: 0;
  }
  .tab-profile-wrapper {
    border-top: 1px solid var(--neutral-800);
  }
}
</style>
