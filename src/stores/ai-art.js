import { defineStore } from 'pinia'
import { store } from './index.js'
import { FAKE_DATA_IMG_RENDER, FAKE_DATA_CHOOSE_OPTION_DEFAULT } from '@/helper/const-ai-art'
import {
  getDataChooseOptionApi,
  getInteractionsApi,
  postInteractionsApi,
  getInteractionsResultApi,
  cancelRequestApi
} from '@/api/ai-art'

async function handleApi(resolve, reject, serviceFn, context, mutationEvent) {
  try {
    const resp = await serviceFn
    if (resp.data.status_code === 200 && mutationEvent) {
      context.commit(mutationEvent, resp.data.data)
    }
    resolve(resp.data)
  } catch (err) {
    resolve({
      status_code: 500,
      messages: err.message,
      data: []
    })
  }
}
export const aiArtStore = defineStore('aiArtStore', {
  state: () => ({
    step: 1,
    textInput: '',
    imageUrl: null,
    imageFile: null,
    isPending: false,
    history: [],
    historyApiStore: [],
    optionChoose: [],
    optionChoosePending: [],
    dataSideBarChooseOption: [],
    dataImgRender: {},
    dataPending: {},
    isShowImgDetail: false,
    dataImgRenderDetail: '',
    position: null,
    type: null,
    indexHistory: null,
    responseImage: null,
    dataDefaultSideOption: [],
    isShowErrorMessage: false,
    isCancelService: false,
    idCancelRequest: null,
    idTimeoutRequest: null,
    isShowListTagFocus: false,
    idInterval: null
  }),
  getters: {
    getStep(state) {
      return state.step
    },
    getDataImgRenderDetail(state) {
      return state.dataImgRenderDetail
    },
    getTextInput(state) {
      return state.textInput
    },
    getImageUrl(state) {
      return state.imageUrl
    },
    getImageFile(state) {
      return state.imageFile
    },
    getIsPending(state) {
      return state.isPending
    },
    getHistory(state) {
      return state.history
    },
    getHistoryApiStore(state) {
      return state.historyApiStore
    },
    getOptionChoose(state) {
      return state.optionChoose
    },
    getOptionChoosePending(state) {
      return state.optionChoosePending
    },
    getDataSideBarChooseOption_(state) {
      return state.dataSideBarChooseOption
    },
    getDataImgRender(state) {
      return state.dataImgRender
    },
    getDataPending(state) {
      return state.dataPending
    },
    getIsShowImgDetail(state) {
      return state.isShowImgDetail
    },
    getPosition(state) {
      return state.position
    },
    getType(state) {
      return state.type
    },
    getIndexHistory(state) {
      return state.indexHistory
    },
    getResponseImage(state) {
      return state.responseImage
    },
    getDataDefaultSideOption(state) {
      return state.dataDefaultSideOption
    },
    getIsShowErrorMessage(state) {
      return state.isShowErrorMessage
    },
    getIsCancelService(state) {
      return state.isCancelService
    },
    getIdCancelRequest(state) {
      return state.idCancelRequest
    },
    getIdTimeoutRequest(state) {
      return state.idTimeoutRequest
    },
    getIsShowListTagFocus(state) {
      return state.isShowListTagFocus
    }
  },
  actions: {
    handleSetStep(data) {
      this.step = data
    },
    handleSetTextInput(data) {
      this.textInput = data
    },
    handlesImageUrl(data) {
      this.imageUrl = data
    },
    handlesImageFile(data) {
      this.imageFile = data
    },
    handlesIsPending(data) {
      this.isPending = data
    },
    handlesSetHistory(data) {
      this.history.push(data)
    },
    handlesSetHistoryApiStore(data) {
      this.historyApiStore = data
    },
    handlesAddHistoryApiStore(data) {
      this.historyApiStore = [...data, ...this.historyApiStore]
    },
    handlesSetOptionChoose(data) {
      this.optionChoose = data
    },
    handlesSetOptionChoosePending(data) {
      this.optionChoosePending = data
    },
    handlesSetDataSidebarChooseOption(data) {
      this.dataSideBarChooseOption = data
    },
    handlesSetDataImgRender(data) {
      this.dataImgRender = data
    },
    handlesSetDataPending(data) {
      this.dataPending = data
    },
    handlesSetIsShowImgDetail(data) {
      this.isShowImgDetail = data
    },
    handlesSetDataImgRenderDetail(data) {
      this.dataImgRenderDetail = data
    },
    handlesSetPosition(data) {
      this.position = data
    },
    handlesSetType(data) {
      this.type = data
    },
    handlesSetIndexHistory(data) {
      this.indexHistory = data
    },
    handlesSetResponseImage(data) {
      this.responseImage = data
    },
    handlesSetDataDefaultSideOption(data) {
      this.dataDefaultSideOption = data
    },
    handlesSetIsErrorMessage(data) {
      this.isShowErrorMessage = data
    },
    handlesSetIsCancelService(data) {
      this.isCancelService = data
    },
    handleSetIdCancelRequest(data) {
      this.idCancelRequest = data
    },
    handleSetIsShowListTagFocus(data) {
      this.isShowListTagFocus = data
    },
    async getDataChooseOption() {
      const resApi = await getDataChooseOptionApi()
      resApi.data.forEach((item) => {
        item.options.unshift({
          id: 0,
          name: 'None',
          url: 'https://i.imgur.com/GFwEBxP.png'
        })
      })
      const resFinal = [...FAKE_DATA_CHOOSE_OPTION_DEFAULT, ...resApi.data]
      resFinal.forEach((item, index) => {
        item.options.forEach((itemC, indexC) => {
          itemC.keyIdC = indexC
          itemC.keyIdP = index
          if (itemC.name === 'None' || itemC.name === 'Square') {
            itemC.typeChoose = 'Default'
          } else {
            itemC.typeChoose = itemC.name
          }
        })
      })
      return { data: resFinal }
    },
    getDataRenderImg() {
      return { data: FAKE_DATA_IMG_RENDER }
    },
    getInteractions: async function (params) {
      try {
        return await getInteractionsApi(params)
      } catch (err) {
        return {
          status_code: 500,
          messages: err.message,
          data: []
        }
      }
    },
    async postInteractions(body) {
      return await postInteractionsApi(body)
    },
    async getInteractionsResult(params, tokenCancel) {
      return await getInteractionsResultApi(params)
    },
    async cancelRequest(body) {
      return await cancelRequestApi(body)
    },
    setIsCancelService(data) {
      this.isCancelService = data
    },
    setTimeoutRequest(data) {
      this.idTimeoutRequest = data
    },
    setIdInterval(data) {
      this.idInterval = data
    }
  }
})

export function aiArtStoreWithOut() {
  return aiArtStore(store)
}
