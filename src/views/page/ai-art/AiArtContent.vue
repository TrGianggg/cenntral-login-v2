<template>
  <div
    class="w-full pt-[64px] md:pt-0 relative flex flex-col justify-between h-screen overflow-hidden overflow-y-visible ai-art-page px-3 md:px-4 xl:px-6 xl:pl-9"
  >
    <div class="flex-1 overflow-hidden overflow-y-visible pr-3">
      <div
        id="artAiContent"
        ref="artAiContent"
        class="container-ai-art-content block-content"
      >
        <div
          v-if="isShowStart"
          class="pb-[200px]"
        >
          <StepOne v-if="step === 1"></StepOne>
        </div>
        <div v-else>
          <InfiniteLoading
            :top="true"
            class="invisible"
            @infinite="handleScrollLoadMore"
          />
          <StepTwo
            v-if="step === 2"
            @scrollBottom="scrollBottomRenderArt"
          ></StepTwo>
        </div>
        <div id="tagScroll"></div>
      </div>
    </div>
    <div class="w-full px-3 md:px-0">
      <div
        id="wrapperInputUpload"
        ref="wrapperInputUpload"
        :class="'wrapper-input-upload w-full relative' + (_isPending ? 'input-pending' : '')"
      >
        <div class="block z-[100] w-full absolute bottom-[120px] md:pr-3 right-0">
          <div class="w-full flex justify-between items-end m-auto mb-[12px] mt-[12px]">
            <div v-show="!isShowListTagFocus"></div>
            <div
              v-show="isShowListTagFocus"
              class="list-choose-option flex flex-wrap gap-[10px]"
            >
              <ButtonGenImg
                v-for="(item, index) in optionChoose
                  .slice(0, optionChoose.length)
                  .filter((item) => item.name !== 'None')"
                :key="index"
                class="!py-[4px] !px-[12px] border-0 !rounded !h-[36px]"
              >
                <span class="text-body-3 font-normal mr-[12px] text-text-gray-1">{{
                  item.name
                }}</span>
                <img
                  src="@/assets/icons/ai-art/close-icon-tag.svg"
                  alt=""
                  @click="deleteOptionChoose(item)"
                />
              </ButtonGenImg>
            </div>

            <div>
              <div
                v-if="!_isPending"
                class="w-full flex xl:hidden justify-end pb-2"
              >
                <img
                  class="w-12"
                  src="@/assets/icons/ai-art/icon-show-choose-option.svg"
                  alt="icon-show-choose-option"
                  @click.stop="handleOpenOption"
                />
              </div>
              <div
                v-if="!_isPending"
                class="flex relative"
                @mouseover="showEditImg"
                @mouseleave="hiddenEditImg"
                @click="upLoadImage"
              >
                <div class="relative rounded-[4px] bg-img-upload-temp flex flex-col-reverse">
                  <div
                    v-if="isUploadingImg"
                    class="w-[210px] h-[107px] rounded-[8px] relative overflow-hidden img-uploaded flex justify-center items-center cell-upload"
                  >
                    <span class="loader"></span>
                  </div>
                  <div
                    v-if="imageUrl"
                    class="w-[210px] h-[107px] rounded-[8px] relative overflow-hidden img-uploaded flex justify-center"
                    @mouseover="showEditImg"
                  >
                    <img
                      :src="imageUrl"
                      class="absolute z-1 avatar-base w-max h-full object-contain"
                      alt=""
                    />
                    <img
                      src="@/assets/icons/ai-art/layer-upload-img.svg"
                      class="absolute z-2 avatar-layer w-full h-full object-cover"
                      alt=""
                    />
                    <button
                      class="avatar-close absolute z-50 top-[13px] right-[11px]"
                      @click.stop="deleteUpload"
                    >
                      <img
                        src="@/assets/icons/ai-art/close-icon.svg"
                        alt=""
                      />
                    </button>
                  </div>
                  <ButtonGenImg v-if="!isUploadingImg && imageUrl === null && !_isPending">
                    <span class="text-body-3">{{ $t('ai-art.add-image') }}</span>
                  </ButtonGenImg>
                  <input
                    type="file"
                    class="hidden"
                    accept=".png, .jpg, .jpeg"
                    id="upLoadImage"
                    @change="onChangeImage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="m-auto relative pb-3 xl:pb-[40px] bg-neutral-900 pt-4 md:pr-3"
          :class="{
            'mt-[7px]': optionChoose.filter((item) => item.name !== 'None').length === 0
          }"
        >
          <div class="background-hide-message"></div>
          <InputGenImg
            @emitSend="sendContentInputGenImg"
            class="z-[10]"
          ></InputGenImg>
        </div>
      </div>
    </div>
    <a-modal
      width="100%"
      :closable="false"
      class="modal-show-image-mobile"
      :footer="false"
      title=""
      v-model:visible.sync="isShowImgDetail"
    >
      <DetailsImg @scrollBottom="scrollBottomRenderArt" />
    </a-modal>
  </div>
</template>
<script>
import { mapActions, mapState } from 'pinia'
import { aiArtStore } from '@/stores/ai-art'
import { isEqual } from 'lodash'
import moment from 'moment/moment'
import { FAKE_DATA_CHOOSE_OPTION_DEFAULT, TYPE_GEN, STATUS_RESPONSE } from '@/helper/const-ai-art'
import StepOne from './component/ai-art-premium/StepOne.vue'
import ButtonGenImg from './component/ai-art-premium/ButtonGenImg.vue'
import InputGenImg from './component/ai-art-premium/InputGenImg.vue'
import StepTwo from './component/ai-art-premium/StepTwo.vue'
import DetailsImg from './component/ai-art-premium/DetailsImg.vue'
import {
  checkBodyInteractions,
  handlesOptionPending,
  prevHandlesType_Property,
  resetHashTag
} from '@/helper/const-ai-art'
import { ART_AI, MAX_SIZE_IMG_UPLOAD } from '@/helper/const-ai-art'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { scrollToElement } from '@/helper'
import InfiniteLoading from 'v3-infinite-loading'
import { computed, watch } from 'vue'
import router from '@/router'

export default {
  name: 'AiArt',
  components: { InfiniteLoading, DetailsImg, StepTwo, ButtonGenImg, StepOne, InputGenImg },
  emits: ['changeOpenChooseOption'],
  setup(_, { emit }) {
    const { t } = useI18n()
    const handleOpenOption = () => {
      emit('changeOpenChooseOption', true)
    }

    const aiArt = computed(() => {
      return aiArtStore()
    })
    // watch(
    //   () => router.currentRoute.value.name,
    //   () => {
    //     clearInterval(aiArt.value.idInterval)
    //   }
    // )
    return { t, handleOpenOption }
  },
  data() {
    return {
      isDisabledUpload: false,
      dataOptionChooseDelete: {},
      textError: '',
      limit: 10,
      cursorAfter: null,
      isShowStart: false,
      isUploadingImg: false,
      isLoadMore: false,
      idArtLast: null,
      drawerSelectFilter: false
    }
  },
  computed: {
    ...mapState(aiArtStore, {
      step: 'getStep',
      textInput: 'getTextInput',
      optionChoose: 'getOptionChoose',
      getDataSideBarChooseOption_: 'getDataSideBarChooseOption_',
      imageUrl: 'getImageUrl',
      dataImgRender: 'getDataImgRender',
      _isPending: 'getIsPending',
      isShowImgDetail: 'getIsShowImgDetail',
      imageFile: 'getImageFile',
      historyApiStore: 'getHistoryApiStore',
      dataDefaultSideOption: 'getDataDefaultSideOption',
      isShowListTagFocus: 'getIsShowListTagFocus',
      dataSideBarChooseOption_: 'getDataDefaultSideOption',
      isCancelService: 'getIsCancelService'
    })
  },
  watch: {
    drawerSelectFilter() {
      const wrapperInputUpload = document.getElementById('wrapperInputUpload')
      if (wrapperInputUpload) {
        if (document.getElementById('contentStepTwoMobile')) {
          document.getElementById('contentStepTwoMobile').style.paddingBottom =
            wrapperInputUpload.offsetHeight - 244 + 'px'
        }
      }
    }
  },
  async created() {
    await this.initGetInteractions()
  },
  mounted() {
    const avatarBase = document.querySelector('.avatar-base')
    const avatarLayer = document.querySelector('.avatar-layer')
    const avatarClose = document.querySelector('.avatar-close')
    if (avatarBase) {
      avatarBase.style.display = 'block'
    }
    if (avatarLayer) {
      avatarLayer.style.display = 'none'
    }
    if (avatarClose) {
      avatarClose.style.display = 'none'
    }
  },
  methods: {
    ...mapActions(aiArtStore, {
      getDataRenderImg: 'getDataRenderImg',
      handleSetStep: 'handleSetStep',
      handlesSetHistory: 'handlesSetHistory',
      handleSetTextInput: 'handleSetTextInput',
      handlesSetDataSidebarChooseOption: 'handlesSetDataSidebarChooseOption',
      handlesSetOptionChoose: 'handlesSetOptionChoose',
      postInteractions: 'postInteractions',
      getInteractions: 'getInteractions',
      getInteractionsResult: 'getInteractionsResult',
      handlesSetDataImgRender: 'handlesSetDataImgRender',
      handlesImageUrl: 'handlesImageUrl',
      handlesSetDataPending: 'handlesSetDataPending',
      handlesIsPending: 'handlesIsPending',
      handlesImageFile: 'handlesImageFile',
      handlesSetHistoryApiStore: 'handlesSetHistoryApiStore',
      handlesAddHistoryApiStore: 'handlesAddHistoryApiStore',
      handleSetIsShowListTagFocus: 'handleSetIsShowListTagFocus',
      handleSetIdCancelRequest: 'handleSetIdCancelRequest'
    }),
    resetHashTag,
    prevHandlesType_Property,
    checkBodyInteractions,
    handlesOptionPending,
    handleAvatarSuccess(file) {
      this.handlesImageUrl(URL.createObjectURL(file))
      this.handlesImageFile(file)
    },
    async initGetInteractions() {
      const params = {
        limit: this.limit,
        after: this.cursorAfter,
        filters: {
          type: 'art'
        }
      }
      try {
        const { data: res } = await this.getInteractions(params)
        if (res.data) {
          this.handlesSetHistoryApiStore([...res.data?.reverse()])
          if (res.data.length === 0) {
            this.handleSetStep(1)
            this.isShowStart = true
          } else {
            this.handleSetStep(2)
            this.isShowStart = false
            this.cursorAfter = res.cursor.afterCursor
            this.idArtLast = this.historyApiStore[0]?.id
          }
          this.resetHashTag()
        }
        this.scrollBottomRenderArt()
      } catch (e) {
        console.log(e)
      }
    },
    async loadMoreHistory() {
      this.isLoadMore = true
      const params = {
        limit: this.limit,
        after: this.cursorAfter,
        filters: {
          type: 'art'
        }
      }
      try {
        const { data: res } = await this.getInteractions(params)
        if (res.data) {
          await this.handlesAddHistoryApiStore([...res.data?.reverse()])
          this.cursorAfter = res.cursor.afterCursor
          setTimeout(() => {
            this.scrollIntoViewLoadMore()
          }, 200)
        }
      } catch (e) {
        console.log(e)
      }
    },

    handleScrollLoadMore() {
      if (this.cursorAfter) {
        this.loadMoreHistory()
      }
    },
    scrollIntoViewLoadMore() {
      if (this.isLoadMore) {
        document.getElementById(this.idArtLast)?.scrollIntoView(true)
        this.idArtLast = this.historyApiStore[0]?.id
        this.isLoadMore = false
      }
    },
    async onChangeImage(event) {
      const file = event.target.files[0]
      const fileType = ['image/jpeg', 'image/png']
      const isImg = fileType.includes(file.type?.toString())
      const isMaxSize = file.size / 1024 / 1024 < MAX_SIZE_IMG_UPLOAD
      if (!isImg) {
        message.error(this.t('common.validate.type_image'))
      } else if (!isMaxSize) {
        message.error(this.t('common.validate.type_image'))
      }
      if (isImg && isMaxSize) {
        await this.handleAvatarSuccess(file)
      }
    },

    upLoadImage() {
      document.getElementById('upLoadImage')?.click()
    },
    deleteUpload() {
      this.isDisabledUpload = true
      this.handlesImageUrl(null)
    },
    showEditImg() {
      const avatarBase = document.querySelector('.avatar-base')
      const avatarLayer = document.querySelector('.avatar-layer')
      const avatarClose = document.querySelector('.avatar-close')
      if (avatarBase) {
        avatarBase.style.display = 'block'
      }
      if (avatarLayer) {
        avatarLayer.style.display = 'block'
      }
      if (avatarClose) {
        avatarClose.style.display = 'block'
      }
      this.isDisabledUpload = false
    },
    hiddenEditImg() {
      const avatarBase = document.querySelector('.avatar-base')
      const avatarLayer = document.querySelector('.avatar-layer')
      const avatarClose = document.querySelector('.avatar-close')
      if (avatarBase) {
        avatarBase.style.display = 'block'
      }
      if (avatarLayer) {
        avatarLayer.style.display = 'none'
      }
      if (avatarClose) {
        avatarClose.style.display = 'none'
      }
      this.isDisabledUpload = false
    },
    async sendContentInputGenImg(val) {
      this.handleSetIsShowListTagFocus(false)
      const { properties, aspectRatio, quality } = this.prevHandlesType_Property(this.optionChoose)
      const body_ = new FormData()
      body_.append('type', ART_AI.TYPE.DEFAULT)
      body_.append('aspectRatio', aspectRatio)
      body_.append('customImage', this.imageFile)
      body_.append('content', val)
      body_.append('parentId', null)
      body_.append('imagePosition', null)
      body_.append('quality', quality)
      body_.append('tomiruType', TYPE_GEN.ART)
      for (let i = 0; i < properties.length; i++) {
        body_.append(`properties[${i}]`, properties[i])
      }
      const body = {
        type: ART_AI.TYPE.DEFAULT,
        ...this.prevHandlesType_Property(this.optionChoose),
        content: val,
        customImage: this.imageUrl,
        parentId: null,
        imagePosition: null
      }
      if (this.checkBodyInteractions(ART_AI.TYPE.DEFAULT, body).code === 200) {
        const cloneOptions = [...this.dataSideBarChooseOption_]
        const options = cloneOptions.map((dataItem) => {
          return {
            ...dataItem,
            options: dataItem.options.map((item, index) => {
              if (index === 0) {
                return { ...item, activeBtn: true }
              } else {
                return { ...item, activeBtn: false }
              }
            })
          }
        })
        this.handlesSetDataSidebarChooseOption(options)
        await this.handlesIsPending(true)
        this.scrollBottomRenderArt()
        this.handlesSetDataPending(this.handlesOptionPending(body, this.optionChoose))
        try {
          const res = await this.postInteractions(body_)
          this.handleSetIdCancelRequest(res.data.id)
          this.handleSetTextInput('')
          this.handlesImageUrl(null)
          this.handlesImageFile(null)
          const hashTagDefault = []
          hashTagDefault.push(
            {
              ...FAKE_DATA_CHOOSE_OPTION_DEFAULT[0].options[0],
              keyIdC: 0,
              keyIdP: 0,
              typeChoose: 'Default',
              activeBtn: true
            },
            {
              ...FAKE_DATA_CHOOSE_OPTION_DEFAULT[1].options[0],
              keyIdC: 0,
              keyIdP: 1,
              typeChoose: 'Default',
              activeBtn: true
            }
          )
          this.handlesSetOptionChoose(hashTagDefault)
          if (res.data) {
            let counter = 0
            const _clearInterval = setInterval(async () => {
              if (this.isCancelService) {
                clearInterval(_clearInterval)
              }
              const resResult = await this.getInteractionsResult({ id: res.data.id })
              if (resResult?.data?.status === STATUS_RESPONSE.CANCEL) {
                clearInterval(_clearInterval)
                this.handlesIsPending(false)
                const messageError = this.t('ai-art.notication-error')
                message.error(messageError)
              } else {
                if (resResult?.data?.responseImage) {
                  clearInterval(_clearInterval)
                  this.handlesSetDataImgRender(resResult?.data)
                  let temp = []
                  temp = [...this.historyApiStore]
                  temp.push({ ...resResult?.data })
                  await this.handlesSetHistoryApiStore(temp)
                  this.handlesIsPending(false)
                  this.handleSetStep(2)
                  this.scrollBottomRenderArt()
                  this.isShowStart = false
                  this.resetHashTag()
                  setTimeout(() => {
                    const artAiContent = document.getElementById('contentStepTwo')
                    if (artAiContent) {
                      window.scrollTo({ top: artAiContent.offsetHeight, behavior: 'smooth' })
                    }
                  }, 100)
                  return
                }
                counter++
                if (counter >= 200) {
                  const messageError = this.t('ai-art.notication-error')
                  message.error(messageError)
                  clearInterval(_clearInterval)
                  this.handlesIsPending(false)
                  this.resetHashTag()
                }
              }
            }, ART_AI.TIME_MESSAGE)
            this.handleSetIdCancelRequest(_clearInterval)
          }
        } catch (error) {
          this.handlesIsPending(false)
          if (error.response && error.response.status === 400) {
            message.error(error.response.data.message)
          } else {
            const messageError = this.t('ai-art.notication-error')
            message.error(messageError)
          }
          this.resetHashTag()
        }
      } else {
        this.textError = this.checkBodyInteractions(ART_AI.TYPE.DEFAULT, body).text
        message.error(this.textError)
      }
    },
    deleteOptionChoose(item) {
      const temp = [...this.getDataSideBarChooseOption_]
      temp[item.keyIdP].options[item.keyIdC].activeBtn = false
      temp[item.keyIdP].options[0].activeBtn = true
      this.handlesSetDataSidebarChooseOption(temp)
      const tempDataChooseOption = [...this.optionChoose]
      const findIndex = tempDataChooseOption.findIndex((itemF) => isEqual(itemF, item))
      tempDataChooseOption[findIndex] = { ...temp[item.keyIdP].options[0] }
      this.handlesSetOptionChoose(tempDataChooseOption)
    },
    convertTimeToSecondsAgo(timestamp) {
      return moment(timestamp).fromNow()
    },
    scrollBottomRenderArt() {
      setTimeout(() => {
        scrollToElement('tagScroll')
      }, 200)
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';
.wrapper-content-ai-art {
  .block-size-choose-option-mb {
    width: 0;
    overflow: hidden;
    top: 0;
    right: 0;
    transition: 0.5s ease-in-out;

    .wrapper-side-choose-option {
      position: absolute;
      height: 100vh;
      max-width: 460px;
      top: 0;
      right: 0;
      @media only screen and (max-width: 639px) {
        max-width: calc(100vw - 85px);
      }
    }
  }

  .block-size-choose-option-mb.active {
    width: calc(100vw);
    overflow: auto;
    transition: 0.5s ease-in-out;
  }

  .btn-close-hide-choose-option {
    @media only screen and (max-width: 639px) {
      border: 1px solid var(--01, #847c97);
      background: var(--04, #292532);
      left: 26px;
    }
  }
}

::v-deep .el-loading-spinner {
  top: 0;
  margin-top: 0 !important;
  width: 100%;
  text-align: center;
  position: absolute;
  height: 100%;
}

.loader {
  width: 54px;
  height: 54px;
  border: 7px solid #978f7c;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.cell-upload {
  border-radius: 8px;
  border: 1px dashed $color-primary-border-btn-aigen;
}

.modal-show-image-mobile {
  .ant-modal-content {
    background: unset;
  }
  .ant-modal-body {
    padding: 0;
  }
}
</style>
