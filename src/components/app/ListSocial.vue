<template>
  <div :class="`list-social tablet:justify-center rounded-full flex flex-row items-center gap-4`">
    <a
      v-for="item in LIST_SOCIAL"
      :key="item.link"
      :href="item.link"
      target="_blank"
      class="button-icon-social"
    >
      <img
        :style="`width:${width}`"
        :src="item.icon"
      />
    </a>
  </div>
</template>
<script>
import IconTelegram from '@/assets/icons/social/icon-telegram.svg'
import IconTweeter from '@/assets/icons/social/icon-tweeter.svg'
import IconFacebook from '@/assets/icons/social/icon-facebook.svg'
export default {
  name: 'CompListSocial',
  props: {
    width: {
      type: String,
      default: '36px'
    }
  },
  setup() {
    const LIST_SOCIAL = [
      {
        icon: IconFacebook,
        link: import.meta.env.VITE_BASE_LINK_FACEBOOK
      },
      {
        icon: IconTelegram,
        link: import.meta.env.VITE_BASE_LINK_TELEGRAM
      },
      {
        icon: IconTweeter,
        link: import.meta.env.VITE_BASE_LINK_TWEETER
      }
    ]
    return { LIST_SOCIAL }
  }
}
</script>
<style lang="scss">
.list-social {
  .button-icon-social {
    transition: all 0.8s;
    cursor: pointer;

    &:hover {
      scale: 1.1;
    }
  }
}
</style>
