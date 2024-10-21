<template>
  <div class="wrapper-side-choose-option">
    <div
      class="py-[0px] pr-0 laptop_:py-[33px] laptop_:pr-[25px] h-full pl-0 laptop_:pl-[30px] w-[485px]"
    >
      <div class="content-side-choose-option">
        <div
          v-for="(item, index) in dataChoose"
          :key="index"
          :class="[index !== 0 ? 'mt-[10px] md:mt-[32px]' : '', index === 1 ? 'quality_class' : '']"
        >
          <div class="flex flex-start items-center mb-[16px]">
            <p class="text-[16px] text-white font-bold">{{ item.name }}</p>
            <div
              v-if="item.name === 'Quality'"
              class="relative ml-[16px]"
            >
              <IconTooltipExclamationMark
                @mouseover="showTooltip = true"
                @mouseleave="showTooltip = false"
              ></IconTooltipExclamationMark>
              <p
                v-if="showTooltip"
                class="p-[10px] text-body-4 text-white absolute content-tooltip-quality"
              >
                {{ $t('ai-art.info-quality') }}
              </p>
            </div>
          </div>
          <div class="flex w-max">
            <div
              v-for="(itemC, indexC) in item.options"
              :key="indexC"
              class="mr-[20px]"
            >
              <ChooseOptionGenImg
                :class="[
                  index === 0 ? `first first_${indexC}` : '',
                  indexC === 0 ? 'not-allow' : '',
                  itemC.activeBtn === true ? 'active' : ''
                ]"
                @emitClick="clickChooseOption(index, indexC)"
              >
                <img
                  v-if="itemC.name === 'None'"
                  class="w-[80%] h-[80%]"
                  src="@/assets/icons/ai-art/not-allow-icon.svg"
                  alt=""
                />
                <img
                  v-else
                  class="w-[80%] h-[80%]"
                  :src="itemC.url"
                  alt=""
                />
              </ChooseOptionGenImg>
              <p class="mt-[8px] text-center text-primary-aigen text-[16px]">
                {{ itemC.name === 'None' ? 'Không có' : itemC.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'pinia'
import { aiArtStore } from '@/stores/ai-art'
import ChooseOptionGenImg from './ChooseOptionGenImg.vue'
import IconTooltipExclamationMark from '@/components/shared/icons/IconTooltipExclamationMark.vue'

export default {
  components: { IconTooltipExclamationMark, ChooseOptionGenImg },
  data() {
    return {
      showTooltip: false
    }
  },
  computed: {
    ...mapState(aiArtStore, {
      dataSideBarChooseOption_: 'dataSideBarChooseOption',
      optionChoose: 'getOptionChoose',
      getDataSideBarChooseOption_: 'getDataSideBarChooseOption_'
    }),
    dataChoose() {
      return this.dataSideBarChooseOption_
    }
  },
  watch: {
    getDataSideBarChooseOption_(val) {}
  },
  async created() {
    try {
      const res = await this.getDataChooseOption()
      this.handlesSetDataDefaultSideOption([...res.data])
      this.handlesSetDataSidebarChooseOption([...res.data])
      const temp = [...this.getDataSideBarChooseOption_]
      temp.forEach((item) => {
        item.options.forEach((itemC, indexC) => {
          itemC.activeBtn = indexC === 0
        })
      })
      this.handlesSetDataSidebarChooseOption(temp)

      const arrActiveBtn = []
      temp.forEach((item) => {
        item.options.forEach((itemC) => {
          if (itemC.activeBtn === true) {
            arrActiveBtn.push(itemC)
          }
        })
      })
      this.handlesSetOptionChoose(arrActiveBtn)
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    ...mapActions(aiArtStore, {
      getDataChooseOption: 'getDataChooseOption',
      handlesSetOptionChoose: 'handlesSetOptionChoose',
      handlesSetOptionChoosePending: 'handlesSetOptionChoosePending',
      handlesSetDataSidebarChooseOption: 'handlesSetDataSidebarChooseOption',
      handlesSetDataDefaultSideOption: 'handlesSetDataDefaultSideOption',
      handleSetIsShowListTagFocus: 'handleSetIsShowListTagFocus'
    }),
    resetBtnActive(index) {
      let temp = []
      temp = [...this.dataSideBarChooseOption_]
      this.dataSideBarChooseOption_[index].options.forEach((item) => {
        if (item.activeBtn === true) {
          item.activeBtn = false
        }
      })
      this.handlesSetDataSidebarChooseOption(temp)
    },
    clickChooseOption(index, indexC) {
      this.handleSetIsShowListTagFocus(true)
      this.resetBtnActive(index)
      const dataTemp = [...this.getDataSideBarChooseOption_]
      dataTemp[index].options[indexC].activeBtn = true
      this.handlesSetDataSidebarChooseOption(dataTemp)
      const arrActiveBtn = []
      const dataSideBarChooseOption__ = [...this.dataSideBarChooseOption_]
      dataSideBarChooseOption__.forEach((item) => {
        item.options.forEach((itemC) => {
          if (itemC.activeBtn === true) {
            arrActiveBtn.push(itemC)
          }
        })
      })
      this.handlesSetOptionChoose(arrActiveBtn)
      this.handlesSetOptionChoosePending(arrActiveBtn)
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/design/variable';

.wrapper-side-choose-option {
  @apply xl:py-6;
}
.content-side-choose-option {
  max-width: calc(100vw - 85px);
  width: 100%;
}
@media only screen and (max-width: 639px) {
  .content-side-choose-option {
    @apply pb-0 xl:pb-[120px];
    > div:last-child {
      margin-bottom: 24px;
    }
  }
}
.content-tooltip-quality {
  border-radius: 8px;
  border: 1px solid #978f7c;
  background: $neutral-700;
  width: 202px;
  z-index: 10;
  top: 8px;
  left: 30px;
}
.quality_class img {
  width: 100% !important;
  height: 100% !important;
}
</style>
