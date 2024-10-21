import { notification } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'

export const useMessage = () => {
  const { t } = useI18n()
  const listTypeNotify = {
    success: t('message.success'),
    error: t('message.error'),
    warning: t('message.warning')
  }
  const setMessageNotification = (type, message) => {
    notification[type]({
      message: () => listTypeNotify[type],
      description: () => message,
      class: `notification-custom-${type} ant-notification-custom`
    })
  }

  const setMessageErrorGlobal = (message) => {
    notification.error({
      message: () => t('message.error'),
      description: () => message || t('message.error_content'),
      class: `notification-custom-erorr ant-notification-custom`
    })
  }
  return {
    setMessageNotification,
    setMessageErrorGlobal
  }
}
