<template>
  <div
    v-show="userInfo?.package?.name"
    class="option-package w-full flex flex-col items-center gap-[28px] pb-8 xl:pb-12"
  >
    <p class="text-gold-150 text-center text-heading-3 uppercase">
      Gói {{ userInfo?.package?.name }}
    </p>
    <div
      v-if="timePackage > 0"
      class="option-package__time flex flex-row items-center gap-2"
    >
      <img
        :src="IconClockGold"
        alt="IconClockGold"
      />
      <div class="flex flex-row items-center text-white">
        <vue-countdown
          :time="timePackage"
          v-slot="{ days, hours, minutes, seconds }"
        >
          <p class="text-white text-body-1">
            Thời hạn sử dụng {{ days }}d : {{ hours }}h : {{ minutes }}m : {{ seconds }}s
          </p>
        </vue-countdown>
      </div>
    </div>
    <p
      v-else
      v-show="['Trial', 'Premium'].includes(userStore().userInfo?.package?.name)"
      class="text-gold-150 text-center text-heading-3 uppercase"
    >
      Đã hết thời gian sử dụng
    </p>
    <!-- v-if="['Trial', 'Default'].includes(userStore().userInfo?.package?.name) || timePackage < 0" -->
    <a-button
      type="primary"
      class="w-full max-w-[270px]"
      @click="() => emit('changeBuyPackage')"
    >
      <span class="!font-bold"
        >{{
          userStore().userInfo?.package?.name === 'Premium'
            ? 'Gia hạn gói Premium'
            : 'Nâng cấp lên Gói Thành Viên'
        }}
      </span>
    </a-button>
    <!--    -->
    <div
      v-for="option in states.listOption"
      :class="[
        'grid grid-cols-2 border w-full border-neutral-600 border-solid rounded-2xl p-3 md:p-6',
        timePackage > 0 ? '' : 'opacity-40 select-none'
      ]"
    >
      <div class="flex flex-col gap-3 w-full">
        <p class="text-gold-150 text-heading-3">{{ option.name }}</p>
        <p
          class="text-white text-body-3"
          v-html="option.subName"
        ></p>
        <a-button
          v-if="timePackage > 0"
          class="max-w-[172px]"
          type="primary"
          style="height: 36px !important; padding: 0 24px !important"
          @click="handleUseAi(option.link)"
          ><span class="text-body-4 md:!text-base !font-bold">Sử dụng ngay</span></a-button
        >
      </div>
      <div>
        <img
          :class="['max-w-[250px] w-full', option.key === 3 ? 'max-h-[159px]' : '']"
          :src="option.image"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, defineEmits, reactive } from 'vue'
import Option1 from '@/assets/images/member-package/option_1.png'
import Option2 from '@/assets/images/member-package/option_2.png'
import IconClockGold from '@/assets/icons/icon-clock-gold.svg'
import { userStore } from '@/stores/userStore'
import { useAppStore } from '@/stores/appStore'
import IconAvatar from '@/assets/icons/ai-art/icon-ai-avatar.svg'
import router from '@/router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const states = reactive({
  listOption: [
    {
      name: t('chat.menu.gpt'),
      subName: 'Trợ lý biết tuốt giải đáp <br/> mọi thắc mắc của bạn',
      image: Option2,
      link: 'tom-chat',
      key: 1
    },
    {
      name: t('ai-art.menu.avatar'),
      subName: 'Hiện đại hóa hình ảnh của bạn chưa bao giờ dễ dàng đến vậy!',
      image: IconAvatar,
      link: 'tom-avatar',
      key: 3
    },
    {
      name: t('ai-art.menu.art'),
      subName: 'Biến giấc mơ của bạn thành hiện <br/> thực bằng phép thuật mang tên AI',
      image: Option1,
      link: 'tom-art',
      key: 2
    }
  ]
})

const emit = defineEmits(['changeBuyPackage'])
const userInfo = computed(() => {
  return userStore().userInfo
})
const timePackage = computed(() => {
  const currentDate = new Date().getTime()
  return userInfo.value?.expiredPremiumAt - currentDate
})

const handleUseAi = (link) => {
  if (link) {
    router.push({
      name: link
    })
  } else {
    useAppStore().setModalComingSoon(true)
  }
}
</script>
