<template>
  <div class="w-full h-full flex justify-center">
    <div class="wrapper-step-two w-full flex justify-center pb-[200px] md:pb-5">
      <div
        id="contentStepTwo"
        class="content-step-two w-full pb-[0px] lg:pb-[0px]"
        style="height: max-content"
      >
        <div class="show-pc">
          <template
            v-for="(item, index) in historyApiStore"
            :key="index"
          >
            <div
              v-if="item.responseImage"
              :id="item.id"
              :class="'item-img-rendered'"
            >
              <div class="mb-4 flex justify-start w-full items-end">
                <div class="flex items-center w-full flex-wrap gap-[10px]">
                  <div class="flex justify-between items-center">
                    <div class="w-min">
                      <IconUpscale
                        class="w-6 h-6"
                        v-if="item.type === 3"
                      >
                      </IconUpscale>
                      <IconVariant
                        v-if="item.type === 2"
                        class="w-6 h-6"
                      ></IconVariant>
                    </div>
                    <p
                      class="text-color-tag-description-aigen text-[16px] leading-[145%] mr-[8px]"
                      :class="item.type === 1 ? 'ml-[0px]' : 'ml-[16px]'"
                    >
                      {{ item.content }}
                    </p>
                  </div>
                  <div
                    v-if="item.properties"
                    class="flex mb-[2px] flex-wrap gap-[10px]"
                  >
                    <ButtonGenImg class="!py-[4px] !px-[12px] border-0 !rounded !h-[28px]">
                      <span class="text-body-5 !font-semibold mb-0">
                        {{ convertNameTag(item.aspectRatio) }}
                      </span>
                    </ButtonGenImg>
                    <ButtonGenImg class="!py-[4px] !px-[12px] border-0 !rounded !h-[28px]">
                      <span class="text-body-5 !font-semibold mb-0">
                        {{ convertNameTag(item.quality) }}
                      </span>
                    </ButtonGenImg>
                    <ButtonGenImg
                      v-for="itemC in item.properties"
                      :key="itemC.name"
                      class="!py-[4px] !px-[12px] border-0 !rounded !h-[28px]"
                    >
                      <span class="text-body-5 !font-semibold mb-0"> {{ itemC.name }} </span>
                    </ButtonGenImg>
                  </div>
                </div>
                <div class="hidden lg:block">
                  <p
                    class="text-primary-aigen text-[16px] leading-[145%] w-max pb-[10px] lg:pb-[0px]"
                  >
                    {{ convertTimeToSecondsAgo(item.createdAt) }}
                  </p>
                </div>
              </div>
              <div
                v-if="item.type === 1 || item.type === 2"
                class="flex h-fit block-list-img-render flex-wrap 2xl:flex-nowrap w-full gap-[10px]"
              >
                <div
                  v-for="(itemA, indexA) in arrClassItemRender"
                  :key="itemA"
                  class="relative overflow-hidden h-auto w-[calc(50%-5px)] rounded-xl"
                  @mouseover="focusBtn(index, indexA, item, false)"
                  @mouseleave="() => (focusLayer = [])"
                >
                  <img
                    class="w-full h-full opacity-0"
                    :src="item.responseImage"
                    alt=""
                    @load="handleImageLoad(index)"
                  />
                  <div class="absolute top-0 left-0 w-[200%] h-[200%]">
                    <ShowImage
                      :list-class="[
                        itemA,
                        checkIsEqualFocus([index, indexA]) ? 'active' : '',
                        '_layer1 absolute w-[100%] h-[100%] z-1'
                      ]"
                      :source-image="item.responseImage"
                    ></ShowImage>
                    <div
                      v-if="checkIsEqualFocus([index, indexA])"
                      class="_layer2 absolute top-0 left-0 flex justify-center flex-col gap-4 items-center layer-contain-btn"
                    >
                      <a-button
                        :disabled="_isPending"
                        type="primary"
                        class="w-[70%]"
                        @click="makeVariations(index, indexA, false)"
                      >
                        <div class="flex flex-row items-center justify-center w-full">
                          <IconVariant class="w-6 h-6 mr-4"></IconVariant>
                          <span class="">{{ $t('ai-art.make-variations') }}</span>
                        </div>
                      </a-button>
                      <a-button
                        :disabled="_isPending"
                        type="primary"
                        class="w-[70%]"
                        @click="upScale(index, indexA, false)"
                      >
                        <div class="flex flex-row items-center justify-center w-full">
                          <IconUpscale class="w-6 h-6 mr-4"></IconUpscale>
                          <span class="">{{ $t('ai-art.upscale') }}</span>
                        </div>
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="item.type === 3"
                class="w-full flex"
              >
                <div class="flex items-end">
                  <div class="hidden lg:block">
                    <div class="flex items-end">
                      <div
                        class="relative overflow-hidden h-max w-full max-w-[400px] rounded-[12px]"
                        @mouseover="focusBtn(index, 0, item, false)"
                        @mouseleave="() => (focusLayer = [])"
                      >
                        <img
                          class="w-full h-full"
                          :src="item.responseImage"
                          alt=""
                          @load="handleImageLoad(index)"
                        />
                        <div class="absolute top-0 left-0 w-[100%] h-[100%]">
                          <ShowImage
                            :list-class="[
                              0,
                              checkIsEqualFocus([index, 0]) ? 'active' : '',
                              '_layer1 absolute w-[100%] h-[100%] z-1'
                            ]"
                            :source-image="item.responseImage"
                          ></ShowImage>
                          <div
                            v-if="checkIsEqualFocus([index, 0])"
                            class="_layer2_ absolute top-0 left-0 flex justify-center flex-col items-center layer-contain-btn"
                          >
                            <a-button
                              :disabled="_isPending"
                              type="primary"
                              class="btn-generate w-[150px] iphone12:w-[170px] xl:w-[150px] h-[40px] 2xl:w-[170px] 2xl:h-[40px] flex justify-center items-center mb-[8px]"
                              @click="makeVariations(index, 0, false)"
                            >
                              <div class="flex flex-row items-center justify-center w-full">
                                <IconVariant class="w-6 h-6 mr-4"></IconVariant>
                                <span class="">{{ $t('ai-art.make-variations') }}</span>
                              </div>
                            </a-button>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col ml-4 gap-4">
                        <a-button
                          :loading="states.loadingPost"
                          type="primary"
                          class="!flex !flex-row !items-center justify-center"
                          @click="postImage(item)"
                        >
                          <div class="flex flex-row items-center gap-4 justify-center w-full">
                            <PictureOutlined class="text-xl mb-2"></PictureOutlined>
                            <span>{{ $t('common.post_image') }}</span>
                          </div>
                        </a-button>
                        <a-button
                          type="primary"
                          @click="openDialogShare(item)"
                        >
                          <div class="flex flex-row items-center justify-center w-full">
                            <img
                              class="mr-[14px]"
                              src="@/assets/icons/ai-art/icon-share.svg"
                              alt=""
                            />
                            <span>{{ $t('common.share') }}</span>
                          </div>
                        </a-button>
                        <a-button
                          :loading="loadingDownload === index"
                          class="flex flex-row items-center"
                          type="primary"
                          @click="downloadImg(item, index)"
                        >
                          <div class="flex flex-row items-center justify-center w-full">
                            <img
                              class="mr-[14px]"
                              src="@/assets/icons/ai-art/icon-download-mb.svg"
                              alt=""
                            />
                            <span>{{ $t('common.download') }}</span>
                          </div>
                        </a-button>
                      </div>
                    </div>
                  </div>
                  <div class="block lg:hidden">
                    <div
                      class="relative overflow-hidden h-[161px] w-[161px] iphone12:h-max iphone12:w-[247px] rounded-[12px]"
                      style="width: 100%; height: max-content"
                      @mouseover="focusBtn(index, 0, item, false)"
                      @mouseleave="() => (focusLayer = [])"
                    >
                      <img
                        class="w-full h-full opacity-0"
                        :src="item.responseImage"
                        alt=""
                      />
                      <div class="absolute top-0 left-0 w-[100%] h-[100%]">
                        <ShowImage
                          :list-class="[
                            0,
                            checkIsEqualFocus([index, 0]) ? 'active' : '',
                            '_layer1 absolute w-[100%] h-[100%] z-1'
                          ]"
                          :source-image="item.responseImage"
                        ></ShowImage>
                        <div
                          v-if="checkIsEqualFocus([index, 0])"
                          class="_layer2_ absolute top-0 left-0 flex justify-center flex-col items-center layer-contain-btn"
                        >
                          <a-button
                            type="primary"
                            class="btn-generate w-[150px]"
                            @click="makeVariations(index, 0, false)"
                          >
                            <div class="flex flex-row items-center justify-center w-full">
                              <IconVariant class="w-6 h-6 mr-4"></IconVariant>
                              <span class="">{{ $t('ai-art.make-variations') }}</span>
                            </div>
                          </a-button>
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-between mt-[10px] items-start">
                      <div class="flex gap-2">
                        <a-button
                          type="primary"
                          class="!h-[40px] !px-6 !flex !items-center"
                          @click="openDialogShare(item)"
                        >
                          <img
                            src="@/assets/icons/ai-art/icon-share.svg"
                            alt=""
                          />
                        </a-button>
                        <!--                      <div-->
                        <!--                        v-if="detectDeviceType === 'iOS'"-->
                        <!--                        class="h-fit w-[180px] lg:px-[33px flex justify-start"-->
                        <!--                      >-->
                        <!--                        <span-->
                        <!--                          class="pl-[17px] color-primary-border-btn-aigen text-[12px] leading-[134%]"-->
                        <!--                        >-->
                        <!--                          {{ $t('ai-art.text-download-iphone-action') }}<br />-->
                        <!--                          {{ $t('ai-art.text-download-iphone-label_1') }}<br />-->
                        <!--                          {{ $t('ai-art.text-download-iphone-label_2') }}<br />-->
                        <!--                        </span>-->
                        <!--                      </div>-->
                        <a-button
                          :loading="loadingDownload === index"
                          type="primary"
                          class="!h-[40px] !px-6 !flex !items-center"
                          @click="downloadImg(item, index)"
                        >
                          <img
                            src="@/assets/icons/ai-art/icon-download-mb.svg"
                            alt=""
                          />
                        </a-button>
                        <a-button
                          :loading="states.loadingPost"
                          type="primary"
                          class="!h-[40px] !px-6 !flex !items-center"
                          @click="postImage(item)"
                        >
                          <div class="flex flex-row items-center gap-4 justify-center w-full">
                            <PictureOutlined class="text-lg mb-[6px]"></PictureOutlined>
                          </div>
                        </a-button>
                      </div>
                      <div>
                        <p
                          class="text-primary-aigen text-[12px] leading-[145%] mt-[13px] sm:max-w-fit"
                        >
                          {{ convertTimeToSecondsAgo(item.createdAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="item.type !== 3"
                class="md:hidden flex justify-end items-center w-full"
              >
                <p class="text-primary-aigen text-body-5 mt-4">
                  {{ convertTimeToSecondsAgo(item.createdAt) }}
                </p>
              </div>
              <div
                :class="!(historyApiStore.length === index + 1) ? '' : 'opacity-0'"
                class="w-full h-[1px] my-[28px] opacity-1 lg:opacity-0 bg-color-primary-bg-aigen"
              ></div>
            </div>
          </template>
          <div class="pr-0 iphone12:pr-[10px]">
            <PendingRender v-if="isPending" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <CreatePostModal
    ref="createModal"
    :imageFileProp="states.dataImagePost"
  ></CreatePostModal>
  <a-modal
    :footer="false"
    class="modal-share-image-ai"
    v-model:visible="isShowDialogShare"
    :after-close="handleCloseShare"
  >
    <div>
      <p class="text-title-dialog text-gold-150">{{ $t('ai-art.title-dialog-share') }}</p>
      <p class="text-content-dialog !text-neutral-400 !text-center">
        {{ $t('ai-art.content-dialog-share') }}
      </p>
      <div class="list-icon-social-share flex justify-center items-center">
        <a
          :href="`https://t.me/share/url?url=${dataShareSocial.responseImage}`"
          target="_blank"
        >
          <img
            src="@/assets/icons/ai-art/icon-tele.svg"
            alt=""
          />
        </a>
        <a
          :href="`http://twitter.com/share?url=${dataShareSocial.responseImage}`"
          target="_blank"
        >
          <img
            src="@/assets/icons/ai-art/icon-twitter.svg"
            alt=""
          />
        </a>
        <a
          :href="`http://www.facebook.com/sharer.php?u=${dataShareSocial.responseImage}`"
          target="_blank"
        >
          <img
            src="@/assets/icons/ai-art/icon-facebook.svg"
            alt=""
          />
        </a>
        <a @click="copyToClipboard(dataShareSocial.responseImage)">
          <img
            src="@/assets/icons/ai-art/icon-url.svg"
            alt=""
          />
        </a>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { mapActions, mapState } from 'pinia'
import { message } from 'ant-design-vue'
import { aiArtStore } from '@/stores/ai-art'
import { detectDeviceType, scrollToElement } from '@/helper'
import _ from 'lodash'
import moment from 'moment'
import {
  ART_AI,
  checkBodyInteractions,
  convertHashTagUpVa,
  convertNameTag,
  FAKE_DATA_CHOOSE_OPTION_DEFAULT,
  handlesOptionPending,
  prevHandlesType_Property,
  resetHashTag,
  resizeHeightBlockStepTwo,
  SCREEN_MOBILE,
  STATUS_RESPONSE,
  TYPE_GEN
} from '@/helper/const-ai-art'
import IconVariant from '@/components/shared/icons/IconVariant.vue'
import { PictureOutlined } from '@ant-design/icons-vue'
import PendingRender from './PendingRender.vue'
import ShowImage from './ShowImage.vue'
import ButtonGenImg from './ButtonGenImg.vue'
import { useI18n } from 'vue-i18n'
import IconUpscale from '@/components/shared/icons/IconUpscale.vue'
import CreatePostModal from '@/components/feed/CreatePostModal.vue'
import { reactive, ref } from 'vue'
import { urlsToFiles } from '@/helper/ultil'

export default {
  components: {
    IconUpscale,
    PictureOutlined,
    PendingRender,
    IconVariant,
    ButtonGenImg,
    CreatePostModal,
    ShowImage
  },
  setup() {
    const { t } = useI18n()
    const createModal = ref(null)
    const states = reactive({
      dataImagePost: [],
      loadingPost: false
    })
    const postImage = async (item) => {
      states.loadingPost = true
      states.dataImagePost = await urlsToFiles([item.responseImage])
      createModal.value.open()
      states.loadingPost = false
    }
    return { t, postImage, createModal, states }
  },
  data() {
    return {
      loadingDownload: '',
      focusLayer: [],
      checkEqualFocus: false,
      arrClassItemRender: [
        'top-0 left-0',
        'top-0 left-[-50%]',
        'top-[-50%] left-[0%]',
        'top-[-50%] left-[-50%]'
      ],
      dataHistoryApi: [],
      arrIndexLoadDoneImg: [],
      isShowDialogShare: false,
      listShareSocial: [
        { icon: '/icon/icon-tele.svg', link: '' },
        { icon: '/icon/icon-twitter.svg', link: '' },
        { icon: '/icon/icon-facebook.svg', link: '' }
      ],
      dataShareSocial: {}
    }
  },
  computed: {
    ...mapState(aiArtStore, {
      history: 'getHistory',
      _isPending: 'isPending',
      dataImgRender: 'getDataImgRender',
      optionChoose: 'getOptionChoose',
      isPending: 'getIsPending',
      historyApiStore: 'getHistoryApiStore',
      isCancelService: 'getIsCancelService'
    })
  },
  watch: {
    isPending(val) {
      if (val !== true) {
        this.resetHashTag()
        this.handleSetIsShowListTagFocus(false)
      }
    }
  },
  mounted() {
    window.addEventListener('load', (e) => {
      this.scrollBottomRenderArt()
    })
    window.addEventListener('resize', (e) => {
      this.resizeHeightBlockStepTwo()
    })
  },
  methods: {
    detectDeviceType,
    convertHashTagUpVa,
    resetHashTag,
    convertNameTag,
    prevHandlesType_Property,
    checkBodyInteractions,
    resizeHeightBlockStepTwo,
    handlesOptionPending,
    ...mapActions(aiArtStore, {
      getInteractions: 'getInteractions',
      postInteractions: 'postInteractions',
      setIdInterval: 'setIdInterval',
      getInteractionsResult: 'getInteractionsResult',
      handlesSetDataImgRender: 'handlesSetDataImgRender',
      handleSetStep: 'handleSetStep',
      handlesSetHistory: 'handlesSetHistory',
      handlesIsPending: 'handlesIsPending',
      handlesSetIsShowImgDetail: 'handlesSetIsShowImgDetail',
      handlesSetDataImgRenderDetail: 'handlesSetDataImgRenderDetail',
      handlesSetHistoryApiStore: 'handlesSetHistoryApiStore',
      handlesSetDataPending: 'handlesSetDataPending',
      handlesSetPosition: 'handlesSetPosition',
      handlesSetType: 'handlesSetType',
      handlesSetIndexHistory: 'handlesSetIndexHistory',
      handlesSetResponseImage: 'handlesSetResponseImage',
      handleSetIsShowListTagFocus: 'handleSetIsShowListTagFocus',
      handlesSetOptionChoose: 'handlesSetOptionChoose',
      setIsCancelService: 'setIsCancelService',
      handleSetIdCancelRequest: 'handleSetIdCancelRequest',
      handlesSetOptionChoosePending: 'handlesSetOptionChoosePending',
      setTimeoutRequest: 'setTimeoutRequest'
    }),
    focusBtn(index, indexA, item, _isHistory) {
      if (window.innerWidth <= SCREEN_MOBILE) {
        this.handlesSetIndexHistory(index)
        this.handlesSetPosition(indexA)
        this.handlesSetResponseImage(item.responseImage)
        this.handlesSetType(item.type)
        this.handlesSetIsShowImgDetail(true)
      } else {
        this.focusLayer = [index, indexA]
      }
    },
    checkIsEqualFocus(arr) {
      return _.isEqual(this.focusLayer, arr)
    },
    async makeVariations(index, indexA, isHistory) {
      this.handleSetIsShowListTagFocus(false)
      this.handlesSetOptionChoosePending(this.convertHashTagUpVa(this.historyApiStore[index]))
      this.setIsCancelService(false)
      this.resizeHeightBlockStepTwo()
      this.handlesIsPending(true)
      let parentId = null
      let content = null
      let properties = null
      let tomiruType = TYPE_GEN.ART
      parentId = this.historyApiStore[index].id
      content = this.historyApiStore[index].content
      properties = this.historyApiStore[index].properties
      const prevHandlesType_Property = delete this.prevHandlesType_Property(this.optionChoose)
        .quality
      const body = {
        type: ART_AI.TYPE.VARIANT,
        ...prevHandlesType_Property,
        parentId,
        content,
        properties,
        tomiruType,
        imagePosition: indexA + 1
      }
      this.handlesSetDataPending(this.handlesOptionPending(body, this.optionChoose))
      if (this.checkBodyInteractions(ART_AI.TYPE.VARIANT, body).code === 200) {
        try {
          this.scrollBottomRenderArt()
          const res = await this.postInteractions(body)
          this.handleSetIdCancelRequest(res.data?.id)
          if (res.data) {
            let counter = 0
            const _clearInterval = setInterval(async () => {
              this.setIdInterval(_clearInterval)
              if (this.isCancelService) {
                clearInterval(_clearInterval)
                return
              }
              const resResult = await this.getInteractionsResult({ id: res.data?.id })
              if (resResult?.data?.status === STATUS_RESPONSE.CANCEL) {
                clearInterval(_clearInterval)
                this.handlesIsPending(false)
                const messageError = this.t('ai-art.notication-error')
                message.error(messageError)
              } else {
                if (resResult?.data?.responseImage) {
                  clearInterval(_clearInterval)
                  this.handlesSetDataImgRender(resResult?.data)
                  this.handlesSetHistory(resResult?.data)
                  // coding
                  let temp = []
                  temp = [...this.historyApiStore]
                  temp.push({ ...resResult?.data })
                  this.handlesSetHistoryApiStore(temp)
                  this.handlesIsPending(false)
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
                  this.handleSetStep(2)
                  this.scrollBottomRenderArt()
                }
                counter++
                if (counter >= import.meta.env.VITE_BASE_API_URL_AI) {
                  const messageError = this.t('ai-art.notication-error')
                  message.error(messageError)
                  clearInterval(_clearInterval)
                  this.handlesIsPending(false)
                }
              }
            }, ART_AI.TIME_MESSAGE)
          }
        } catch (error) {
          let messageError = this.t('ai-art.notication-error')
          if (error.response) {
            if (error?.response?.data?.message) {
              messageError = error.response.data.message
            }
          }
          message.error(messageError)
          this.handlesIsPending(false)
        }
      } else {
        const messageError = this.checkBodyInteractions(ART_AI.TYPE.VARIANT, body).text
        message.error(messageError)
      }
    },
    async upScale(index, indexA, isHistory) {
      this.handleSetIsShowListTagFocus(false)
      this.handlesIsPending(true)
      this.handlesSetOptionChoosePending(this.convertHashTagUpVa(this.historyApiStore[index]))
      this.setIsCancelService(false)
      this.resizeHeightBlockStepTwo()
      this.scrollBottomRenderArt()
      let parentId = null
      let content = null
      let properties = null
      let tomiruType = TYPE_GEN.ART
      parentId = this.historyApiStore[index].id
      content = this.historyApiStore[index].content
      properties = this.historyApiStore[index].properties
      const prevHandlesType_Property = delete this.prevHandlesType_Property(this.optionChoose)
        .quality
      const body = {
        type: ART_AI.TYPE.UPSCALE,
        ...prevHandlesType_Property,
        parentId,
        properties,
        content,
        tomiruType,
        imagePosition: indexA + 1
      }
      this.handlesSetDataPending(this.handlesOptionPending(body, this.optionChoose))
      if (this.checkBodyInteractions(ART_AI.TYPE.UPSCALE, body).code === 200) {
        try {
          const res = await this.postInteractions(body)
          this.handleSetIdCancelRequest(res.data.id)
          if (res.data) {
            let counter = 0
            const _clearInterval = setInterval(async () => {
              this.setIdInterval(_clearInterval)
              if (this.isCancelService) {
                clearInterval(_clearInterval)
                return
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
                  this.handlesSetHistory(resResult?.data)
                  let temp = []
                  temp = [...this.historyApiStore]
                  temp.push({ ...resResult?.data })
                  this.handlesSetHistoryApiStore(temp)
                  this.handlesIsPending(false)
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
                  // this.handlesSetOptionChoose([])
                  this.handleSetStep(2)
                  this.scrollBottomRenderArt()
                }
                counter++
                if (counter >= ART_AI.COUNTER_CALL_API) {
                  const messageError = this.t('ai-art.notication-error')
                  message.error(messageError)
                  clearInterval(_clearInterval)
                  this.handlesIsPending(false)
                }
              }
            }, ART_AI.TIME_MESSAGE)
            this.setTimeoutRequest(_clearInterval)
          }
        } catch (error) {
          console.log(error)
          let messageError = this.t('ai-art.notication-error')
          if (error.response) {
            if (error?.response?.data?.message) {
              messageError = error.response.data.message
            }
          }

          message.error(messageError)
          this.handlesIsPending(false)
        }
      } else {
        const messageError = this.checkBodyInteractions(ART_AI.TYPE.UPSCALE, body).text
        message.error(messageError)
      }
    },
    convertTimeToSecondsAgo(timestamp) {
      let result = moment(timestamp).fromNow()
      const stringReplace = [
        'ago',
        'minutes',
        'minute',
        'years',
        'year',
        'day',
        'days',
        'hours',
        'hour',
        'an',
        'a',
        'few',
        'seconds',
        'second'
      ]
      const stringReplaceResult = [
        'trước',
        'phút',
        'phút',
        'năm',
        'năm',
        'ngày',
        'ngày',
        'giờ',
        'giờ',
        'một',
        'một',
        'vài',
        'giây',
        'giây'
      ]
      stringReplace.forEach((item, index) => {
        result = result?.replace(item, stringReplaceResult[index])
      })
      return result
    },
    async downloadImg(item, index) {
      this.loadingDownload = index
      const image = await fetch(item.responseImage)
      const imageBlog = await image.blob()
      const imageURL = URL.createObjectURL(imageBlog)
      const ext = item.responseImage.split('.')
      const link = document.createElement('a')
      link.href = imageURL

      link.download = `Art-AI-Supreme-${moment().format('YYYY-MM-DD-HH:mm:ss')}.${
        ext[ext.length - 1]
      }`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.loadingDownload = ''
    },
    handleImageLoad(index) {
      if (!this.arrIndexLoadDoneImg.includes(index)) {
        this.arrIndexLoadDoneImg.push(index)
        if (this.arrIndexLoadDoneImg.length === this.historyApiStore.length) {
          this.scrollBottomRenderArt()
          setTimeout(() => {
            scrollToElement('tagScroll')
          }, 100)
        }
      }
    },
    openDialogShare(item) {
      this.isShowDialogShare = true
      this.dataShareSocial = item
    },
    handleCloseShare() {
      this.isShowDialogShare = false
    },
    copyToClipboard(url) {
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message.success('Copied')
    },
    scrollBottomRenderArt() {
      this.$emit('scrollBottom')
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable';

.wrapper-step-two {
  .content-step-two {
  }

  ._layer2 {
    width: 50%;
    height: 50%;
  }

  ._layer2_ {
    width: 100%;
    height: 100%;
  }

  ._layer1.active {
    filter: blur(5px);
  }
}

.history-class.item-img-rendered:last-child {
  .line-divide {
    opacity: 0;
  }
}

@media screen and (max-width: 768px) {
  .item-img-rendered {
    padding-right: 0px !important;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
    opacity: 0;
  }

  .wrapper-step-two {
    max-width: 100%;
    overflow: unset;
  }
}

//@media screen and (max-width: 1365px) {
//  .block-list-img-render {
//     display: grid;
//     grid-template-columns: repeat(2, 211px);
//    justify-content: center;
//    gap: 40px;
//  }
//}
.wrapper-btn-gen-img {
  outline: none;
  background: rgba(151, 143, 124, 0.6);
  border: 0.5px solid $primary-color;
  border-radius: 4px;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
}

.wrapper-btn-gen-img:hover {
  background: rgba(151, 143, 124, 0.8);
  border: 0.5px solid $primary-color;
}

::v-deep .el-dialog__header {
  padding: 0;
}

::v-deep .el-dialog__body {
  padding: 0px 46px;
  @media screen and (max-width: 540px) {
    padding: 0 20px !important;
  }
}

::v-deep .el-dialog {
  max-width: 640px;
  min-width: 343px;
  border-radius: 16px;
  background: $color-primary-bg-btn-aigen;
}

.text-title-dialog {
  padding-top: 70px;
  color: $primary-color;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 36px;
  word-break: break-word;
  @media screen and (max-width: 540px) {
    font-size: 20px !important;
    padding-left: 20px;
    padding-right: 20px;
  }
}

.text-content-dialog {
  color: $primary-color;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 145%;
  margin-bottom: 60px;
  word-break: break-word;
}

.list-icon-social-share {
  a {
    margin-left: 8px;
    margin-right: 8px;

    img {
      width: 60px;
      height: 60px;
    }
    @media screen and (max-width: 540px) {
      img {
        width: 44px;
        height: 44px;
      }
    }
  }

  padding-bottom: 60px;
}

::v-deep .el-dialog__close.el-icon.el-icon-close {
  font-size: 25px;
}

.modal-share-image-ai {
  .ant-modal-body {
    background: $neutral-800;
  }
  @apply w-[100%] md:w-[70%] xl:w-[40%] #{!important};
}

.light-theme {
  .modal-share-image-ai {
    .ant-modal-body {
      background: white;
    }
  }
}
</style>
