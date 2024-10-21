import { createI18n } from 'vue-i18n'
import locale_en from './en'
import locale_vi from './vi'
import { useLocaleStoreWithOut } from '@/stores/locale.js'
import FlagVi from '@/assets/icons/flag-vi.png'
import FlagEn from '@/assets/icons/flag-en.png'

const locale = useLocaleStoreWithOut()
export const LIST_SELECT_LOCALE = [
  {
    value: 'vi',
    locale: locale_vi,
    label: 'Việt Nam',
    flag: FlagVi
  },
  {
    value: 'en',
    locale: locale_vi,
    label: 'English',
    flag: FlagEn
  }
]

export const i18n = createI18n({
  locale: locale?.locale,
  legacy: false,
  allowComposition: true,
  fallbackLocale: 'vi',
  messages: {
    vi: locale_vi,
    en: locale_en
  }
})
