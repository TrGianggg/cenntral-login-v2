<template>
  <vue-recaptcha
    class="recaptcha-custom"
    v-show="showRecaptcha"
    :sitekey="key"
    hl="vi"
    :loading-timeout="loadingTimeout"
    @verify="recaptchaVerified"
    @expire="recaptchaExpired"
    @fail="recaptchaFailed"
    @error="recaptchaError"
    ref="vueRecaptcha"
  >
  </vue-recaptcha>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import VueRecaptcha from 'vue3-recaptcha2'

export default defineComponent({
  components: {
    VueRecaptcha
  },
  emits: ['getRecaptcha'],
  setup(_, { emit }) {
    const showRecaptcha = ref(true)
    const loadingTimeout = ref(30000)
    const key = import.meta.env.VITE_BASE_RE_CAPTCHA
    console.log(key)
    const recaptchaVerified = (response) => {
      emit('getRecaptcha', response)
    }

    const recaptchaExpired = () => {
      this.$refs.vueRecaptcha.reset()
    }
    const recaptchaFailed = () => {
      console.log('recaptchaFailed')
    }

    const recaptchaError = (reason) => {
      console.log('recaptchaError')
    }

    return {
      showRecaptcha,
      key,
      recaptchaVerified,
      recaptchaExpired,
      loadingTimeout,
      recaptchaFailed,
      recaptchaError
    }
  }
})
</script>
<style>
.recaptcha-custom {
  display: flex !important;
}
</style>
