<template>
  <div
    v-show="loadDataDefault"
    ref="boxChatContent"
    class="chat-element pt-[40px] xl:pt-6 lg:px-0 w-full"
  >
    <div
      v-if="listChat?.length"
      ref="chatContent"
      class="chat-content md:!pb-[200px]"
    >
      <InfiniteLoading
        :top="true"
        class="invisible"
        @infinite="handleScroll"
      />
      <div
        v-for="(chat, index) in listChat"
        :id="`${chat?.id}`"
        :key="index"
        class="w-full"
        :class="['chat-item ' + (chat?.role === ROLE_ADMIN ? 'chat-item-1' : '')]"
      >
        <img
          :src="chat?.role === ROLE_ADMIN ? LogoSingle : userInfo?.profileImage || FakeAvatar"
          :class="[chat?.role === ROLE_ADMIN ? '' : 'rounded-full']"
          alt=""
        />
        <span :class="{ 'text-error': chat?.error }">{{ chat?.content }}</span>
      </div>
      <div
        v-if="typing"
        class="chat-item chat-typing chat-item-1"
      >
        <img
          :src="LogoSingle"
          alt=""
        />
        <div>
          <span>...</span>
        </div>
      </div>
    </div>
    <div
      v-else
      class="no-data-chat !pb-[48px] flex flex-col md:pb-0"
    >
      <div class="welcome-chat no-data-item">
        <p class="text-heading-3">{{ $t('chat.welcome_chat') }}</p>
        <span class="text-body-3">{{ $t('chat.welcome_chat_content') }}</span>
      </div>
      <div class="no-data-item">
        <p class="text-body-2 !font-bold">{{ $t('chat.real_time_search') }}</p>
        <span class="text-body-3">{{ $t('chat.real_time_search_content') }}</span>
      </div>
      <div class="no-data-item">
        <p class="text-body-2 !font-bold">{{ $t('chat.long_chat') }}</p>
        <span class="text-body-3">{{ $t('chat.long_chat_content') }}</span>
      </div>
      <div class="no-data-item">
        <p class="text-body-2 !font-bold">{{ $t('chat.brainstorm_ideas') }}</p>
        <span class="text-body-3">{{ $t('chat.brainstorm_ideas_content') }}</span>
      </div>
      <div class="no-data-item">
        <p class="text-body-2 !font-bold">{{ $t('chat.relax_ideas') }}</p>
        <span class="text-body-3">{{ $t('chat.relax_ideas_content') }}</span>
      </div>
    </div>
    <div id="tag-scroll-chat"></div>
    <div class="box-input-ai-chat fixed bottom-0 xl:left-[220px] left-0 right-0 flex">
      <div class="chat-input relative mx-auto py-3">
        <div class="background-hide-message"></div>
        <div class="flex w-full z-[10] relative bg-neutral-900 md:pb-[36px] px-3 xl:px-0">
          <a-textarea
            id="input-chat"
            :autofocus="true"
            v-model:value="inputChat"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :placeholder="$t('chat.input_placeholder_send')"
            :disabled="typing"
          >
          </a-textarea>
          <div class="button-send absolute bottom-[18px] z-[10] md:bottom-[52px] right-[24px]">
            <div
              v-if="typing"
              class="chat-typing"
            >
              <div class="!flex">
                <span class="!m-auto !leading-[25px]">...</span>
              </div>
            </div>
            <div v-else>
              <img
                v-if="inputChat?.trim().length"
                class="cursor-pointer"
                src="@/assets/icons/ai-chat/icon-send-active.svg"
                alt=""
                @click="sendMessage"
              />
              <img
                v-else
                class="cursor-not-allowed"
                src="@/assets/icons/ai-chat/icon-send.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getListMessagesApi, getMessageReplyApi, sendMessageApi } from '@/api/ai-chat'
import { userStore } from '@/stores/userStore'
import LogoSingle from '@/assets/logo_single.png'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { computed, toRefs, ref, onMounted, reactive, onUpdated } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useI18n } from 'vue-i18n'
//
import avatarDefault from '@/assets/logo.png'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import FakeAvatar from '@/assets/images/home/fake-avatar.svg'

export default {
  name: 'AiChat',
  components: {
    InfiniteLoading,
    LoadingOutlined
  },
  setup() {
    const { t } = useI18n()
    const userInfo = computed(() => {
      return userStore().userInfo
    })
    const boxChatContent = ref(null)
    const states = reactive({
      listChat: [],
      inputChat: '',
      ROLE_ADMIN: 'assistant',
      isLoadMore: false,
      MAX_CALL_REPLY: 30,
      TIME_REPLY: 3000,
      limit: 10,
      after: '',
      loadingMessage: false,
      idChatLast: '',
      loading: false,
      typing: false,
      count: 1,
      loadDataDefault: true,
      showGenImage: false,
      isOnline: true
    })
    const loadMessagesBottom = () => {
      const elementScroll = document.getElementById('tag-scroll-chat')
      setTimeout(() => {
        elementScroll?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 200)
    }

    const setDataBreadCrumb = () => {
      const data = [
        {
          label: t('layout.menu_main.home'),
          link: '/'
        },
        {
          label: 'AI Chat'
        }
      ]
      useAppStore().setDataBreadCrumb(data)
    }

    const getListMessages = async () => {
      const params = {
        after: states.after,
        limit: states.limit
      }
      const response = await getListMessagesApi(params)
      if (response.data?.data?.length) {
        states.listChat = response.data?.data?.reverse()
        states.after = response.data?.cursor?.afterCursor
        loadMessagesBottom()
      }
    }

    const loadMore = async () => {
      states.isLoadMore = true
      const response = await getListMessagesApi({
        after: states.after,
        limit: states.limit
      })
      if (response.data?.data?.length) {
        const data = response.data.data.reverse()
        states.listChat = [...data, ...states.listChat]
        states.after = response.data.cursor.afterCursor ? response.data.cursor.afterCursor : ''
      }
    }

    const handleScroll = async () => {
      if (states.after) {
        await loadMore()
      }
    }

    const sendMessageData = async () => {
      const response = await sendMessageApi({
        content: states.inputChat
      })
      if (response.data) {
        states.listChat.push(response.data)
        states.inputChat = ''
        states.typing = true
        return response.data.id
      } else {
        states.inputChat = ''
        states.listChat.push({
          avatar: avatarDefault,
          content: t('chat.error.common'),
          error: true,
          role: states.ROLE_ADMIN
        })
      }
      return ''
    }

    const getMessageReply = async (id) => {
      const response = await getMessageReplyApi({ id })
      states.count = states.count + 1
      if (response.data) {
        states.listChat.push(response.data)
        states.typing = false
        states.loading = false
        loadMessagesBottom()
      } else if (states.count < states.MAX_CALL_REPLY) {
        setTimeout(async () => {
          await getMessageReply(id)
        }, states.TIME_REPLY)
      } else {
        states.typing = false
        states.loading = false
        states.listChat.push({
          avatar: avatarDefault,
          content: t('chat.error.common'),
          error: true,
          role: states.ROLE_ADMIN
        })
        loadMessagesBottom()
      }
    }

    const sendMessage = async () => {
      loadMessagesBottom()
      if (states.isOnline) {
        states.typing = true
        states.loading = true
        const id = await sendMessageData()
        if (id) {
          loadMessagesBottom()
          states.count = 1
          await getMessageReply(id)
        } else {
          states.typing = false
          states.loading = false
        }
      } else {
        states.listChat.push({
          avatar: avatarDefault,
          content: t('error.common'),
          error: true,
          role: states.ROLE_ADMIN
        })
        states.inputChat = ''
      }
    }

    const checkEnter = () => {
      states.inputChat = states.inputChat + '\n'
    }

    onUpdated(() => {
      if (states.isLoadMore) {
        document.getElementById(states.idChatLast)?.scrollIntoView(true)
        states.idChatLast = states.listChat[0]?.id
        states.isLoadMore = false
      }

      const documentInput = document.getElementById('input-chat')
      if (documentInput) {
        documentInput.onkeypress = function (event) {
          const { typing, inputChat } = states
          const isEnterKey = event.key === 'Enter'
          const isShiftKey = event.shiftKey

          if (!typing && isEnterKey) {
            if (inputChat.trim() === '') {
              checkEnter()
            } else if (!isShiftKey) {
              sendMessage()
            }
          }
        }
      }
    })

    onMounted(async () => {
      setDataBreadCrumb()

      states.loadDataDefault = false
      await getListMessages()
      states.loadDataDefault = true
      // loadMessagesBottomFirst()
      window.addEventListener('online', () => {
        states.isOnline = true
      })
      window.addEventListener('offline', () => {
        states.isOnline = false
      })
      loadMessagesBottom()
    })
    return {
      ...toRefs(states),
      sendMessageData,
      boxChatContent,
      handleScroll,
      sendMessage,
      userInfo,
      LogoSingle,
      FakeAvatar
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';
.chat-element {
  min-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  max-width: 909px;
  .show-loading {
    min-height: 50px;
    display: block;
    svg {
      margin: auto;
    }
  }
  .chat-content {
    padding-bottom: 200px;
    width: 100%;
    &::-webkit-scrollbar {
      width: 5px;
      opacity: 1;
    }
    &::-webkit-scrollbar-track {
      opacity: 1;
    }

    &::-webkit-scrollbar {
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb {
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb:hover {
      opacity: 1;
    }

    &::-webkit-scrollbar-button:end {
      background: transparent;
      height: 100px;
    }
    .chat-item {
      display: flex;
      padding: 20px 32px;
      color: #ced1d9;
      margin-bottom: 20px;
      img {
        width: 44px;
        height: 100%;
        margin-right: 32px;
        min-width: 44px;
        object-fit: contain;
      }
      span {
        font-weight: 400;
        font-size: 16px;
        line-height: 145%;
        white-space: pre-line;
        color: #b6b6b6;
        display: flex;
        align-items: center;
        &.text-error {
          color: #ff7070;
        }
      }
      &.chat-item-1 {
        background: $neutral-800;
        border-radius: 16px;
      }
      &.chat-typing {
        div {
          display: flex;
          align-items: center;
        }
        span {
          animation: typing 2s infinite;
          display: block;
          overflow: hidden;
          font-size: 32px;
          line-height: 32px;
        }
      }
    }
  }
  .box-input-chat {
    border-top-right-radius: 16px !important;
    border-top-left-radius: 16px !important;
  }
  .chat-input {
    display: flex;
    max-width: 909px;
    z-index: 2;
    width: 100%;
    background: $neutral-900 !important;
    .ant-input {
      padding: 18px 36px;
      padding-right: 80px;
      border-radius: 16px !important;

      &::placeholder {
        color: $neutral-500;
      }
    }
    .button-send {
      width: 28px;
      height: 28px;
      img {
        width: 28px;
        height: 28px;
      }
      .chat-typing {
        cursor: not-allowed;
        div {
          display: flex;
          align-items: center;
        }
        span {
          animation: typing 2s infinite;
          display: block;
          overflow: hidden;
          font-size: 32px;
          line-height: 32px;
          color: #b6b6b6;
          top: -9px;
          position: relative;
        }
      }
    }
  }
  .no-data-chat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    .no-data-item {
      margin: 18px 0;
      &.welcome-chat p {
        font-size: 36px;
      }
      p {
        line-height: 130%;
        color: $gold-150;
        margin-bottom: 16px;
      }
      span {
        line-height: 145%;
        color: $neutral-400;
        white-space: pre-line;
      }
    }
  }
}

.ai-chat {
  display: flex;
  justify-content: flex-end;
  width: calc(100vw - 256px);
  padding-right: calc(50vw - 455px);
  overflow-x: hidden;
  overflow-y: auto;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@media screen and (max-width: 1450px) {
  .chat-element {
    margin-left: 24px;
    margin-right: 24px;
  }
  .ai-chat {
    justify-content: center;
    width: auto;
    max-width: calc(100% - 280px);
  }
}

@media screen and (max-width: 1250px) {
  .ai-chat {
    padding-right: 32px;
    width: 100%;
    max-width: unset;
  }
  .home.flex {
    justify-content: flex-start;
  }
}

@media screen and (max-width: 1150px) {
  .chat-element {
    width: auto;
  }

  .ai-chat {
    padding-right: 0;
  }
}

@media screen and (max-width: 1024px) {
  .chat-element {
    .chat-input {
      width: 100%;
    }
  }
}
@media screen and (max-width: 865px) {
  body {
    background: $neutral-850;
  }
  .ai-chat {
    background: $neutral-850;
    width: 100vw;
    min-width: 100vw;
  }
  .chat-element {
    margin: 0;
    .chat-content {
      padding-bottom: 134px;
      min-width: 100vw;
      .chat-item:first-child {
        padding-top: 36px;
      }
      .chat-item {
        margin-bottom: 0;
        padding: 20px 16px;
        background: $neutral-850;
        &.chat-item-1 {
          border-radius: 0;
        }
        img {
          width: 32px;
          min-width: 32px;
          margin-right: 12px;
        }
      }
    }
    .chat-input {
      bottom: 0;
      width: 100%;
      border-top: 1px solid #36323e;
      background: $neutral-850;
      .button-send {
        width: 24px;
        height: 24px;
        img {
          width: 24px;
          height: 24px;
        }
      }
    }
    .no-data-chat {
      padding: 0 10px 0 16px;
      .no-data-item {
        margin: 10px 0;
      }
    }
  }
}

@media screen and (max-width: 540px) {
  .ai-chat {
    .chat-element {
      height: fit-content;
      overflow: hidden;
      .no-data-chat {
        margin: 0;
        height: calc(100vh - 134px);
        overflow: auto;
      }
    }
  }
  .chat-input {
    .ant-input {
      padding: 18px 16px !important;
      padding-right: 60px !important;
    }
  }
}

.content-step-one .pending-render {
  width: 100%;
  @media screen and (max-width: 540px) {
    width: 100vw;
  }
}

.box-input-ai-chat {
  background: #0f0f0f;
}

.light-theme {
  .chat-element {
    .chat-content {
      .chat-item-1 {
        background: #e7e7e8;
      }

      .chat-item {
        span {
          color: #0f1419;
        }
      }
    }
  }

  .box-input-ai-chat {
    background: #fff;
  }
}
</style>
