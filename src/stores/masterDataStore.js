import { defineStore } from 'pinia'
import { store } from './index.js'
import { getMasterDataApi } from '@/api/master-data'

export const masterDataStore = defineStore('masterDataStore', {
  state: () => ({
    masterData: {}
  }),
  getters: {
    getListTransactionsType(state) {
      const list = state.masterData?.transactionsType?.map((item) => {
        return {
          value: item.key,
          label: item.name
        }
      })
      list?.unshift({
        value: '',
        label: 'Tất cả'
      })
      return list
    },
    getListIncomeType(state) {
      const list = state.masterData?.incomesType?.map((item) => {
        return {
          value: item.key,
          label: item.name
        }
      })
      list?.unshift({
        value: '',
        label: 'Tất cả'
      })
      return list
    },
    getListToken(state) {
      const list = state.masterData?.tokens?.map((item) => {
        return {
          value: item.symbol,
          label: item.name
        }
      })
      list?.unshift({
        value: '',
        label: 'Tất cả'
      })
      return list
    },
    getPackage(state) {
      return state.masterData?.packages
    },
    getPackageObject(state) {
      const packageObject = {}
      state.masterData?.packages.forEach((item) => {
        packageObject[item.name] = {
          ...item
        }
      })
      console.log(packageObject)
      return packageObject
    }
  },
  actions: {
    setMasterData(data) {
      this.masterData = data
    },
    async getMasterData(recaptcha) {
      const { data } = await getMasterDataApi()
      this.setMasterData(data)

      return data
    }
  }
})

export function useUserStoreWithOut() {
  return masterDataStore(store)
}
