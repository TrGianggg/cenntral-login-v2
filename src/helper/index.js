import { removeToken, removeHashTokenShop, getToken, getHashTokenShop } from '@/helper/http/cookie'
import dayjs from 'dayjs'
import { logOutFn } from '../api/auth'
import router from '@/router'
import { userStore } from '../stores/userStore'

export const scrollToTop = () => {
  const el = document.getElementById('scroll-top')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export const scrollToElement = (id, position = 'center') => {
  let element = document.getElementById(id)
  element?.scrollIntoView({
    behavior: 'smooth',
    block: position
  })
}

export const logOut = async () => {
  // Buoc 1 : remove het token o local
  removeToken()
  removeHashTokenShop()
  localStorage.removeItem('otp_sent_token')

  // Buoc 2 : remove token o server
  // await userStore().logOut()

  window.location.reload()
}

export function formatDecimalNumber(number, maxNumber = 3, minNumber = 1) {
  try {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      useGrouping: true,
      minimumFractionDigits: minNumber,
      maximumFractionDigits: maxNumber
    }).format(number)
    return formattedNumber
  } catch (error) {
    return 'Invalid input'
  }
}

export function formatDate(timestamp, format = 'DD/MM/YYYY hh:mm') {
  return dayjs(timestamp).format(format)
}

export function detectDeviceType() {
  const userAgent = navigator.userAgent
  if (/Android/i.test(userAgent)) {
    return 'Android'
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'iOS'
  } else if (/Windows Phone/i.test(userAgent)) {
    return 'Windows Phone'
  } else if (/Macintosh|MacIntel|MacPPC|MacIntel/i.test(userAgent)) {
    return 'Mac'
  } else if (/Windows|Win32/i.test(userAgent)) {
    return 'Windows'
  } else if (/Linux/i.test(userAgent)) {
    return 'Linux'
  } else {
    return 'Unknown'
  }
}

export function setTimeRemainingOtp(value) {
  const currentTime = new Date().getTime()
  return currentTime + value
}
