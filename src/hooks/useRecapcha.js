import { ref } from 'vue'
import { useReCaptcha } from 'vue-recaptcha'

export default function reCaptcha() {
  const recaptchaToken = ref()
  const { recaptchaLoaded, executeRecaptcha } = useReCaptcha()
  const recaptcha = async () => {
    try {
      await recaptchaLoaded()
      recaptchaToken.value = await executeRecaptcha('login')
    } catch (error) {
      console.log(error)
    }
  }
  return { recaptchaToken, recaptcha }
}
