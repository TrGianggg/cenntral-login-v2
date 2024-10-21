<template>
  <div
    class="details-image"
    style="backdrop-filter: blur(5px)"
  >
    <div class="wrapper-show-detail h-full">
      <div class="relative overflow-hidden w-full rounded-[8px]">
        <img
          class="w-full h-full opacity-0"
          :src="responseImage"
          alt=""
        />
        <div
          class="absolute top-0 left-0"
          :class="type !== 3 ? 'w-[200%] h-[200%]' : 'w-[100%] h-[100%]'"
        >
          <img
            class="_layer1 absolute w-[100%] h-[100%] z-1"
            :class="arrClassItemRender[position]"
            :src="responseImage"
            alt=""
          />
        </div>
      </div>
      <div class="flex flex-col px-3 mt-4">
        <a-button
          :disabled="_isPending"
          type="primary"
          class="w-full"
          @click="makeVariations(indexHistory, position, true)"
          ><div class="w-full flex flex-row items-center justify-center gap-3">
            <IconVariant class="w-6 h-6"></IconVariant>
            <span class="text-body-4">{{ $t('ai-art.make-variations') }}</span>
          </div>
        </a-button>
        <a-button
          :disabled="_isPending"
          type="primary"
          v-if="type !== 3"
          class="w-full py-[11px] flex justify-center items-center mt-[8px]"
          @click="upScale(indexHistory, position, true)"
        >
          <div class="w-full flex flex-row items-center justify-center gap-3">
            <IconUpscale class="mr-[12px] w-6 h-6"></IconUpscale>
            <span class="text-body-4">{{ $t('ai-art.upscale') }}</span>
          </div>
        </a-button>
      </div>
      <div class="flex justify-center w-full py-6">
        <img
          src="@/assets/icons/ai-art/close-icon.svg"
          alt=""
          @click="closeShowImgDetail"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { aiArtStore } from '@/stores/ai-art'
import { FAKE_DATA_CHOOSE_OPTION_DEFAULT, STATUS_RESPONSE, TYPE_GEN } from '@/helper/const-ai-art'
import { convertHashTagUpVa } from '@/helper/const-ai-art'
import ButtonGenImg from './ButtonGenImg.vue'
import { ART_AI } from '@/helper/const-ai-art'
import {
  checkBodyInteractions,
  handlesOptionPending,
  prevHandlesType_Property
} from '@/helper/const-ai-art'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import IconVariant from '@/components/shared/icons/IconVariant.vue'
import IconUpscale from '@/components/shared/icons/IconUpscale.vue'

export default {
  components: { IconUpscale, IconVariant, ButtonGenImg },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      arrClassItemRender: [
        'top-0 left-0',
        'top-0 left-[-50%]',
        'top-[-50%] left-[0%]',
        'top-[-50%] left-[-50%]'
      ]
    }
  },
  computed: {
    ...mapState(aiArtStore, {
      dataImgRenderDetail: 'getDataImgRenderDetail',
      isHistory: 'getHistory',
      historyApiStore: 'getHistoryApiStore',
      history: 'getHistory',
      dataImgRender: 'getDataImgRender',
      optionChoose: 'getOptionChoose',
      _isPending: 'getIsPending',
      position: 'getPosition',
      type: 'getType',
      indexHistory: 'getIndexHistory',
      responseImage: 'getResponseImage',
      dataPending: 'getDataPending',
      isCancelService: 'getIsCancelService'
    })
  },
  created() {},
  methods: {
    ...mapActions(aiArtStore, {
      handlesSetIsShowImgDetail: 'handlesSetIsShowImgDetail',
      getInteractions: 'getInteractions',
      postInteractions: 'postInteractions',
      getInteractionsResult: 'getInteractionsResult',
      handlesSetDataImgRender: 'handlesSetDataImgRender',
      handleSetStep: 'handleSetStep',
      handlesSetHistory: 'handlesSetHistory',
      handlesIsPending: 'handlesIsPending',
      handlesSetDataImgRenderDetail: 'handlesSetDataImgRenderDetail',
      handlesSetDataPending: 'handlesSetDataPending',
      handlesSetHistoryApiStore: 'handlesSetHistoryApiStore',
      handlesSetOptionChoose: 'handlesSetOptionChoose',
      handleSetIsShowListTagFocus: 'handleSetIsShowListTagFocus',
      handlesSetOptionChoosePending: 'handlesSetOptionChoosePending',
      setIsCancelService: 'setIsCancelService',
      handleSetIdCancelRequest: 'handleSetIdCancelRequest',
      setTimeoutRequest: 'setTimeoutRequest'
    }),
    prevHandlesType_Property,
    checkBodyInteractions,
    handlesOptionPending,
    convertHashTagUpVa,
    closeShowImgDetail() {
      this.handlesSetIsShowImgDetail(false)
    },
    async makeVariations(index, indexA, isHistory) {
      this.handleSetIsShowListTagFocus(false)
      this.handlesSetOptionChoosePending(this.convertHashTagUpVa(this.historyApiStore[index]))
      this.setIsCancelService(false)
      this.closeShowImgDetail()
      this.handlesIsPending(true)
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
        type: ART_AI.TYPE.VARIANT,
        ...prevHandlesType_Property,
        parentId,
        content,
        properties,
        tomiruType,
        imagePosition: this.position + 1
      }
      this.handlesSetDataPending(this.handlesOptionPending(body, this.optionChoose))
      if (this.checkBodyInteractions(ART_AI.TYPE.VARIANT, body).code === 200) {
        try {
          const res = await this.postInteractions(body)
          this.handleSetIdCancelRequest(res.data?.id)
          if (res?.data) {
            let counter = 0
            const _clearInterval = setInterval(async () => {
              if (this.isCancelService) {
                clearInterval(_clearInterval)
                return
              }
              const resResult = await this.getInteractionsResult({ id: res?.data?.id })

              if (resResult?.data?.responseImage) {
                clearInterval(_clearInterval)
                this.handlesSetDataImgRender(resResult?.data)
                this.handlesSetHistory(resResult?.data)
                // coding
                let temp = []
                temp = [...this.historyApiStore]
                temp.push({ ...resResult?.data })
                this.handlesSetHistoryApiStore(temp)
                // coding
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
                const wrapperInputUpload = document.getElementById('wrapperInputUpload')
                if (wrapperInputUpload) {
                  if (document.getElementById('contentStepTwoMobile')) {
                    document.getElementById('contentStepTwoMobile').style.paddingBottom =
                      wrapperInputUpload.offsetHeight - 244 + 'px'
                  }
                }
                setTimeout(() => {
                  const artAiContent = document.getElementById('contentStepTwo')
                  if (artAiContent) {
                    window.scrollTo({ top: artAiContent.offsetHeight, behavior: 'smooth' })
                  }
                }, 100)
              }
              counter++
              if (counter >= 20) {
                const messageError = this.t('ai-art.notication-error')
                message.error(messageError)
                clearInterval(_clearInterval)
                this.handlesIsPending(false)
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
        alert(this.checkBodyInteractions(ART_AI.TYPE.VARIANT, body).text)
      }
    },
    async upScale(index) {
      this.handleSetIsShowListTagFocus(false)
      this.handlesIsPending(true)
      this.handlesSetOptionChoosePending(this.convertHashTagUpVa(this.historyApiStore[index]))
      this.setIsCancelService(false)
      this.closeShowImgDetail()
      this.scrollBottomRenderArt()
      let parentId = null
      let content = null
      let properties = null
      let tomiruType = TYPE_GEN.ART
      content = this.historyApiStore[index].content
      parentId = this.historyApiStore[index].id
      properties = this.historyApiStore[index].properties
      const prevHandlesType_Property = delete this.prevHandlesType_Property(this.optionChoose)
        .quality
      const body = {
        type: ART_AI.TYPE.UPSCALE,
        ...prevHandlesType_Property,
        parentId,
        content,
        properties,
        tomiruType,
        imagePosition: this.position + 1
      }
      this.handlesSetDataPending(this.handlesOptionPending(body, this.optionChoose))
      if (this.checkBodyInteractions(ART_AI.TYPE.UPSCALE, body).code === 200) {
        try {
          const res = await this.postInteractions(body)
          this.handleSetIdCancelRequest(res.data?.id)
          if (res.data) {
            let counter = 0
            const _clearInterval = setInterval(async () => {
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
                  const idTimeout = setTimeout(() => {
                    this.scrollBottomRenderArt()
                    clearTimeout(idTimeout)
                  }, 200)
                  const wrapperInputUpload = document.getElementById('wrapperInputUpload')
                  if (wrapperInputUpload) {
                    if (document.getElementById('contentStepTwoMobile')) {
                      document.getElementById('contentStepTwoMobile').style.paddingBottom =
                        wrapperInputUpload.offsetHeight - 244 + 'px'
                    }
                  }
                  setTimeout(() => {
                    const artAiContent = document.getElementById('contentStepTwo')
                    if (artAiContent) {
                      window.scrollTo({ top: artAiContent.offsetHeight, behavior: 'smooth' })
                    }
                  }, 100)
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
            this.setTimeoutRequest(_clearInterval)
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
        const messageError = this.checkBodyInteractions(ART_AI.TYPE.UPSCALE, body).text
        message.error(messageError)
      }
    },
    scrollBottomRenderArt() {
      this.$emit('scrollBottom')
    }
  }
}
</script>
