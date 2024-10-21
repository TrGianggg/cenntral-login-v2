<template>
  <div
    :class="`list-social tablet:justify-center rounded-full select-none flex flex-col items-center gap-5`"
  >
    <a
      v-for="item in LIST_SOCIAL"
      :key="item.link"
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
import IconTelegram from '@/assets/icons/social/icon-telegram-gray.svg'
import IconTweeter from '@/assets/icons/social/icon-twitter-gray.svg'
import IconMessage from '@/assets/icons/social/icon-message-gray.svg'
import IconFacebook from '@/assets/icons/social/icon-facebook-gray.svg'
import IconAttack from '@/assets/icons/social/icon-attach-gray.svg'

export default {
  name: 'CompSocialShare',
  props: {
    width: {
      type: String,
      default: '36px'
    }
  },
  setup() {
    const LIST_SOCIAL = [
      {
        icon: IconAttack,
        key: 'attack'
      },
      {
        icon: IconFacebook,
        key: 'facebook'
      },
      {
        icon: IconMessage,
        key: 'message'
      },
      {
        icon: IconTelegram,
        key: 'telegram'
      },
      {
        icon: IconTweeter,
        key: 'tweeter'
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
