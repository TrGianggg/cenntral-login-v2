<template>
  <div class="w-full flex justify-center pending-render pending-render-page px-0">
    <div
      class="wrapper-step-pending iphone12:w-[442px] lg:w-full h-full flex justify-center px-[0px] iphone12:px-[0px] relative top-[60px] iphone12:top-[0px]"
    >
      <div class="content-step-pending w-full">
        <div class="flex justify-between w-full items-end">
          <div
            class="mb-[17px] flex items-end justify-between w-full flex-wrap news lg:flex-nowrap"
          >
            <div class="flex flex-wrap items-center gap-[10px]">
              <div class="flex justify-between items-center">
                <div style="width: min-content">
                  <IconUpscale
                    class="w-6 h-6"
                    v-if="getDataPending.type === 3"
                  ></IconUpscale>
                  <IconVariant
                    v-if="getDataPending.type === 2"
                    class="w-6 h-6"
                  ></IconVariant>
                </div>
                <p
                  class="text-color-tag-description-aigen text-[16px] leading-[145%] mr-[8px]"
                  :class="getDataPending.type === 1 ? 'ml-[0px]' : 'ml-[16px]'"
                >
                  {{ getDataPending.content }}
                </p>
              </div>
              <div class="flex flex-wrap gap-[10px]">
                <ButtonGenImg
                  v-for="(itemC, indexC) in getDataHashTag.filter((item) => item.name !== 'None')"
                  :key="indexC"
                  class="!py-[4px] !px-[12px] border-0 !rounded !h-[28px]"
                >
                  <span class="text-body-5 !font-bold mb-0">
                    {{ itemC.name }}
                  </span>
                </ButtonGenImg>
              </div>
            </div>
            <div class="hidden lg:block">
              <p class="text-primary-aigen text-[16px] leading-[145%] w-max">
                {{ convertTimeToSecondsAgo(getDataPending.createdAt) }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="getDataPending.type === 1 || getDataPending.type === 2"
          class="flex h-fit block-list-img-render flex-wrap lg:flex-nowrap justify-center iphone12:justify-between w-full gap-[10px] iphone8:gap-[20px]"
        >
          <div
            v-for="(itemA, indexA) in arrClassItemRender"
            :key="indexA"
            class="item-block-loading rounded-[16px] animate-pulse w-[calc(50%-11px)] flex items-center justify-center"
            style="aspect-ratio: 1 / 1"
          >
            <span class="loader"></span>
          </div>
        </div>
        <div
          v-if="getDataPending.type === 1 || getDataPending.type === 2"
          class="lg:hidden"
        >
          <div class="justify-center w-full flex mt-6">
            <div class="flex justify-end h-fit block-list-img-render items-end w-[332px]">
              <p class="text-primary-aigen text-[12px] text-right leading-[145%] w-max">
                {{ convertTimeToSecondsAgo(getDataPending.createdAt) }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="getDataPending.type === 1 || getDataPending.type === 2"
          class="mb-[20px] mt-[17px] gap-4 flex justify-start flex-row-reverse"
        >
          <div class="flex justify-between items-start">
            <div class="hidden lg:block">
              <button
                v-if="getDataPending.type === 1 || getDataPending.type === 2"
                class="btn-cancel-pending w-[169px] min-h-[40px] flex items-center justify-center mt-[0px] rounded-[4px] mb-12 relative"
                @click="handleCancel"
              >
                <img
                  src="@/assets/icons/ai-art/icon_close-pending.svg"
                  alt=""
                />
                <span class="text-white text-sm font-xs ml-2">{{ $t('common.cancel') }}</span>
              </button>
            </div>
            <p class="hidden iphone12:block md:text-[16px] leading-[23px] w-[332px]">
              {{ fnRandomText }}
            </p>
          </div>
          <div class="ticker-wrap block w-full">
            <div class="ticker">
              <div class="ticker__item md:text-[16px] leading-[23px]">
                {{ fnRandomText }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex w-full items-start flex-row lg:hidden">
          <button
            v-if="getDataPending.type === 1 || getDataPending.type === 2"
            class="btn-cancel-pending w-[169px] min-h-[40px] flex items-center mr-0 justify-center mt-[17px] rounded-[4px] mb-12 relative"
            @click="handleCancel"
          >
            <img
              src="@/assets/icons/ai-art/icon_close-pending.svg"
              alt=""
            />
            <span class="text-white text-sm font-xs ml-2">{{ $t('common.cancel') }}</span>
          </button>
        </div>
        <div v-if="getDataPending.type === 3">
          <div class="justify-start w-full flex">
            <div class="flex h-fit block-list-img-render items-end max-w-[400px] w-full">
              <div
                class="relative flex items-center justify-center animate-pulse w-full aspect-square rounded-[16px] bg-color-primary-bg-aigen"
              >
                <div
                  class="absolute flex items-center justify-center rounded-2xl overflow-hidden top-0 left-0 w-[100%] h-[100%]"
                >
                  <div
                    class="_layer2_ absolute item-block-loading top-0 left-0 flex justify-center flex-col items-center layer-contain-btn"
                  ></div>
                  <span class="loader m-auto"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 lg:hidden flex justify-start">
            <div
              class="flex justify-start items-center w-[332px] iphone8_:w-[342px] iphone12:w-full"
            >
              <p
                class="block lg:hidden text-primary-aigen text-12px leading-[145%] mt-[13px] w-max"
                :class="{ 'mt-0': getDataPending.type === 3 }"
              >
                {{ convertTimeToSecondsAgo(getDataPending.createdAt) }}
              </p>
            </div>
          </div>
          <div
            v-if="getDataPending.type === 3"
            class="mb-[20px] mt-[17px] flex justify-start"
          >
            <div class="ticker-wrap block w-full">
              <div class="ticker">
                <div class="ticker__item md:text-[16px] leading-[23px]">
                  {{ fnRandomText }}
                </div>
              </div>
            </div>
            <div class="flex justify-between items-start">
              <div class="hidden lg:!block">
                <button
                  class="ml-[40px] btn-cancel-pending md:w-[210px] w-[150px] min-h-[40px] flex items-center justify-center lg:mt-0 mt-[0px] rounded-[4px] mb-12 relative"
                  @click="handleCancel"
                >
                  <img
                    src="@/assets/icons/ai-art/icon_close-pending.svg"
                    alt=""
                  />
                  <span class="text-white text-sm font-xs ml-2">{{ $t('common.cancel') }}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="justify-start w-full flex">
            <div class="block lg:hidden">
              <button
                class="btn-cancel-pending md:w-[210px] w-[150px] min-h-[40px] flex items-center justify-center mt-[0px] rounded-[4px] mb-12 relative"
                @click="handleCancel"
              >
                <img
                  src="@/assets/icons/ai-art/icon_close-pending.svg"
                  alt=""
                />
                <span class="text-white text-sm font-xs ml-2">{{ $t('common.cancel') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="full h-[30px]"></div>
  </div>
</template>
<script>
import moment from 'moment'
import ButtonGenImg from '@/views/page/ai-art/component/ai-art-premium/ButtonGenImg.vue'
import { ART_AI } from '@/helper/const-ai-art.js'
import { resetHashTag } from '@/helper/const-ai-art.js'
import { mapActions, mapState } from 'pinia'
import { aiArtStore } from '@/stores/ai-art'
import { midjourneyInteractionsApi } from '@/api/ai-art'
import IconUpscale from '@/components/shared/icons/IconUpscale.vue'
import IconVariant from '@/components/shared/icons/IconVariant.vue'

export default {
  components: { IconVariant, IconUpscale, ButtonGenImg },
  data() {
    return {
      dataHashTag: [],
      arrClassItemRender: [
        'top-0 left-0',
        'top-0 left-[-50%]',
        'top-[-50%] left-[0%]',
        'top-[-50%] left-[-50%]'
      ],
      dataRandomText: [
        `Hãy lên dây cót và chuẩn bị cho những chuyến phiêu lưu đầy thú vị phía trước! Trình tạo ảnh của chúng tôi đang phát huy hết tác dụng kỳ diệu của mình để tạo ra điều gì đó phi thường và sẽ chỉ mất 3-4 phút. Trong khi chờ đợi, tại sao bạn không luyện tập đánh những bản guitar hay nhất của mình hoặc nghĩ ra một điệu nhảy ngẫu hứng? Chúng tôi hứa rằng kết quả hình ảnh nhận về sẽ đáng với từng giây mong đợi của bạn!`,
        ` Xin chú ý, những phi hành gia thời gian! Chúng ta sắp bắt đầu cuộc hành trình vào vương quốc của sự sáng tạo. Hãy thắt dây an toàn và chuẩn bị tinh thần khi chúng ta dịch chuyển tới tương lai của những hình ảnh tuyệt vời. Đích đến: một hình ảnh tuyệt đẹp được tạo riêng cho bạn. Vì vậy, hãy ngồi yên, tận hưởng chuyến đi và chỉ trong 3-4 phút, bạn sẽ có trong tay một kiệt tác!`,
        `Xin chú ý, những người đang tìm kiếm cảm giác mạnh! Trình tạo ảnh của chúng tôi giống như một chuyến tàu lượn siêu tốc dành cho trí tưởng tượng của bạn và chúng tôi sắp đưa bạn vào một hành trình thú vị. Hãy thắt dây an toàn và chuẩn bị cho những khúc ngoặt và những điều bất ngờ. Tuy nhiên, xin đừng lo lắng, sẽ chỉ mất 3-4 phút ngắn ngủi cho đến khi bạn nhận được một hình ảnh ấn tượng khiến bạn hét lên vì thích thú!`,
        `Kêu gọi tất cả những người tiên phong kiên nhẫn! Trình tạo ảnh của chúng tôi hiện đang làm việc hăng say để tạo ra một kiệt tác hình ảnh khiến bạn không nói nên lời. Trong khi chờ đợi, tại sao bạn không luyện tập kỹ năng đi trên mặt trăng hoặc thử một số trò tung hứng ấn tượng? Hãy nhớ rằng, chỉ còn vài phút nữa là bạn sẽ được đưa đến một thế giới hình ảnh đầy cảm hứng!`,
        `Hãy lắng nghe, những người đam mê nghệ thuật! Trình tạo ảnh của chúng tôi giống như một bậc thầy họa sĩ tỉ mỉ thêm các nét vẽ vào khung vẽ. Kết quả như thế nào? Là một hình ảnh tinh tế sẽ khiến bạn khó thở. Vì vậy, hãy đội mũ nồi ảo của bạn, tạo dáng và sẵn sàng chứng kiến quá trình sáng tạo diễn ra chỉ trong 3-4 phút. Sự chờ đợi sẽ không khác gì một kiệt tác!`,
        `Thưa quý vị, hãy sẵn sàng để choáng ngợp! Trình tạo ảnh của chúng tôi đang làm việc không mệt mỏi để tạo ra một hình ảnh khiến trái tim bạn lỡ nhịp. Trong khi trí tưởng tượng đang quay, hãy dành chút thời gian để thưởng thức bữa tiệc khiêu vũ ảo hoặc luyện tập bài phát biểu nhận giải Oscar hay nhất của bạn. Đồng hồ đếm ngược đang bật và chỉ sau 3-4 phút nữa, khoảnh khắc đẹp như tranh vẽ của bạn sẽ đến!`,
        `Xin chú ý, những người đang tìm kiếm những điều kỳ diệu về thị giác! Trình tạo ảnh của chúng tôi giống như một phù thủy ẩn mình, triệu hồi ra một bức ảnh quyến rũ chỉ dành cho bạn. Trong khi bạn hứng thú chờ đợi sự ra mắt lớn, tại sao bạn không tham gia một số tư duy phép thuật hoặc thực hành màn biến mất tốt nhất của bạn? Chỉ trong vài phút, phép màu sẽ được mở lời và bạn sẽ bị để lại trong sự kinh ngạc!`,
        `Chuẩn bị cho một cuộc hành trình đầy tiếng cười và sự ngạc nhiên! Trình tạo ảnh của chúng tôi giống như một diễn viên hài biến các pixel thành một kiệt tác vui nhộn. Trong khi bạn đang háo hức chờ đợi phần kết, tại sao không chia sẻ một câu chuyện cười vui nhộn hoặc tham gia vào một câu lạc bộ hài kịch ảo? Chỉ trong 3-4 phút, bạn sẽ được thưởng một hình ảnh khiến bạn cười lăn lộn!`,
        `Hãy chú ý, những người dệt giấc mơ! Trình tạo ảnh của chúng tôi đang bận rộn biến trí tưởng tượng thành hiện thực. Trong khi chờ đợi, tại sao không ôm lấy người mơ mộng bên trong mình và để suy nghĩ của bạn lang thang đến những vùng đất xa xôi, những sinh vật huyền diệu hay thậm chí là một cuộc phiêu lưu ngoài không gian? Trước khi bạn kịp nhận ra, giấc mơ giữa ban ngày của bạn sẽ trở nên sống động dưới dạng một hình ảnh tuyệt đẹp, chỉ cách đó vài phút ngắn ngủi!`,
        `Kêu gọi tất cả các nhà thám hiểm trực quan! Trình tạo ảnh của chúng tôi giống như một thợ săn kho báu đang thực hiện nhiệm vụ khai quật hình ảnh hoàn hảo dành riêng cho bạn. Trong khi bạn đang háo hức chờ đợi sự ra mắt, tại sao không đội chiếc mũ thám hiểm của mình lên và tìm kiếm những kho báu ẩn giấu trong môi trường xung quanh bạn? Chỉ trong 3-4 phút, bạn sẽ được thưởng một viên ngọc trực quan khiến tim bạn lỡ nhịp!`
      ]
    }
  },
  mounted() {
    window.addEventListener('DOMContentLoaded', () => {
      const marquee = document.querySelector('.running-text')
      const marqueeContent = marquee.querySelector('p')
      const marqueeWidth = marquee.clientWidth
      const contentWidth = marqueeContent.offsetWidth

      if (contentWidth > marqueeWidth) {
        marqueeContent.style.animationDuration = contentWidth / 50 + 's'
      }
    })
  },
  computed: {
    ...mapState(aiArtStore, {
      getDataPending: 'getDataPending',
      getDataSideBarChooseOption: 'getDataSideBarChooseOption',
      getOptionChoosePending: 'getOptionChoosePending',
      idTimeoutRequest: 'idTimeoutRequest',
      idCancelRequest: 'idCancelRequest'
    }),
    fnRandomText() {
      return this.dataRandomText[Math.floor(Math.random() * (9 + 1))]
    },
    fnRandomTextInfinity() {
      let temp = ''
      const text = this.dataRandomText[Math.floor(Math.random() * (9 + 1))]
      for (let i = 0; i < 10; i++) {
        temp += text + ' '
      }
      return temp
    },
    dataProperty() {
      if (!this.getDataPending || !this.getDataPending.properties) {
        return []
      }
      // prepare data for loading attribute
      const arr = []
      this.getDataSideBarChooseOption.forEach((choose, index) => {
        choose.options.forEach((option) => {
          if (option.id) {
            arr[option.id] = option.name
          }
        })
      })
      const temp = []
      for (let i = 0; i < this.getDataPending.properties.length; i++) {
        if (this.getDataPending.properties[i].name !== 'None') {
          const id = this.getDataPending.properties[i]
          if (typeof id === 'number') {
            temp.push({
              name: arr[id]
            })
          } else {
            temp.push(this.getDataPending.properties[i])
          }
        }
      }
      const aspectRatios = ART_AI.LIST_RATIO
      for (const k in aspectRatios) {
        const aspectRatio = aspectRatios[k]
        if (
          this.getDataPending.aspectRatio === aspectRatio.aspectRatio &&
          this.getDataPending.aspectRatio !== '1:1'
        ) {
          temp.push({
            name: aspectRatio.name
          })
        }
      }
      return temp
    },
    getDataHashTag() {
      let temp = []
      temp = [...this.getOptionChoosePending]
      return temp
    }
  },
  methods: {
    ...mapActions(aiArtStore, {
      handlesSetDataPending: 'handlesSetDataPending',
      handlesSetIsCancelService: 'handlesSetIsCancelService',
      handlesIsPending: 'handlesIsPending'
    }),
    resetHashTag,
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
    async handleCancel() {
      try {
        this.handlesSetDataPending({})
        this.handlesSetIsCancelService(true)
        this.handlesIsPending(false)
        this.resetHashTag()
        clearInterval(this.idTimeoutRequest)
        console.log(this.idCancelRequest)
        await midjourneyInteractionsApi({
          id: this.idCancelRequest
        })
        setTimeout(() => {
          const artAiContent = document.getElementById('contentStepTwo')
          if (artAiContent) {
            window.scrollTo({ top: artAiContent.offsetHeight, behavior: 'smooth' })
          }
        }, 100)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/design/variable';

.item-block-loading {
  background: #3e3c32;
}

.light-theme {
  .item-block-loading {
    background: #a1a1a1;
  }
}
.wrapper-step-pending {
  overflow: auto;
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

.btn-cancel-pending {
  border: 1px solid $color-warning-pending;

  span {
    color: $color-warning-pending;
  }
  @media only screen and (max-width: 639px) {
    margin-bottom: 0;
  }
}

.running-text {
  overflow: hidden;
  white-space: nowrap;
}

.running-text p {
  display: inline-block;
  width: fit-content;
  margin: 0;
  padding: 0;
  animation: marqueeAnimation 200s linear infinite;
}

@keyframes marqueeAnimation {
  0% {
    transform: translateX(100vw);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
