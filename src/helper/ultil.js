import { formatDecimalNumber } from '@/helper/index'
import dayjs from 'dayjs'
import { SUPPORTED_EXTENSIONS } from '@/helper/const'
import moment from 'moment'
export const formatNumberTable = (page = 1, pageSize = 10, index = 1) => {
  return (page - 1) * pageSize + index
}

const optionsLocalString = {
  useGrouping: true,
  maximumFractionDigits: 3,
  minimumFractionDigits: 0,
  decimalSeparator: '.',
  groupingSeparator: ','
}

export function formatNumber(unFormatted, showDigits = 2) {
  if (!unFormatted) return 0
  const absNumber = Math.abs(Number(unFormatted))
  if (absNumber > 0) {
    const digits = Math.ceil(Math.log10(1 / absNumber))
    if (digits < 3) {
      return Number(unFormatted).toLocaleString('en-US', optionsLocalString)
    }
    return Number(unFormatted).toFixed(digits + showDigits)
  } else {
    return 0
  }
}

export const randomString = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.charAt(randomIndex)
  }
  return randomString
}

export const calcUtc0Timestamp = (localTimestamp) => {
  const date = new Date()
  const gmtOffsetMinutes = date.getTimezoneOffset()
  const timeStampToGmt = gmtOffsetMinutes * 60 * 1000 * -1
  return localTimestamp - timeStampToGmt
}
export const calcLocalTimestamp = (utc0Timestamp) => {
  const date = new Date()
  const gmtOffsetMinutes = date.getTimezoneOffset()
  const timeStampToGmt = gmtOffsetMinutes * 60 * 1000 * -1
  return utc0Timestamp + timeStampToGmt
}

// calc dominated color

const calculateAverageColor = (imageData) => {
  let totalRed = 0
  let totalGreen = 0
  let totalBlue = 0
  const pixelCount = imageData.length / 4
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]
    totalRed += r
    totalGreen += g
    totalBlue += b
  }
  const averageRed = Math.round(totalRed / pixelCount)
  const averageGreen = Math.round(totalGreen / pixelCount)
  const averageBlue = Math.round(totalBlue / pixelCount)
  return [averageRed, averageGreen, averageBlue]
}
export async function getDominantColorAsync(imageUrl) {
  return new Promise((resolve) => {
    if (imageUrl) {
      const image = new Image()
      image.crossOrigin = 'Anonymous'
      image.src = imageUrl
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        const color = calculateAverageColor(imageData)
        resolve(`rgb(${color.join(', ')})`)
      }
    } else {
      resolve(null)
    }
  })
}

export function formatTime(timestamp) {
  const date = dayjs(+timestamp)
  return date.format('D-MM-YYYY')
}

const getTimesFromNow = (timestamp) => {
  const now = new Date()
  const date = new Date(timestamp)
  const timeDifference = now - date

  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const years = Math.floor(days / 365);
  return {
    minutes,
    days,
    hours,
    seconds,
    years
  }
}

export function formatMessageTime(timestamp) {
  const { days, years } = getTimesFromNow(timestamp)
  const fullDate = dayjs(+timestamp)
  if (years > 0) {
    return fullDate.format('DD-MM-YYYY HH:mm')
  }
  if (days > 0) {
    return fullDate.format('DD-MM HH:mm')
  }
  return fullDate.format('HH:mm A')
}

export function formatFullTime(timestamp) {
  const date = dayjs(+timestamp)
  return date.format('DD-MM-YYYY HH:mm')
}

export function timePostAgo(timestamp) {
  const { minutes, days, hours } = getTimesFromNow(timestamp);
  if (days > 0) {
    if (days > 10) {
      const dateFull = dayjs(+timestamp)
      return dateFull.format('DD-MM-YYYY HH:mm')
    }
    return days + (days === 1 ? ' ngày' : ' ngày')
  } else if (hours > 0) {
    return hours + (hours === 1 ? ' giờ' : ' giờ')
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? ' phút' : ' phút')
  } else {
    return 'vừa xong'
  }
}

export function formatTimeAgo(timestamp) {
  const { minutes, days, hours } = getTimesFromNow(timestamp);
  if (days > 0) {
    if (days > 10) {
      const dateFull = dayjs(+timestamp)
      return dateFull.format('DD-MM-YYYY HH:mm')
    }
    return days + (days === 1 ? ' ngày trước' : ' ngày trước')
  } else if (hours > 0) {
    return hours + (hours === 1 ? ' giờ trước' : ' giờ trước')
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? ' phút trước' : ' phút trước')
  } else {
    return 'vừa xong'
  }
}

export function getFullNameUser(user) {
  if (user) {
    return `${user.firstName} ${user.lastName}`
  }
  return ''
}

export function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

export function ellipsisText(text, length = 300) {
  if (text.length > length) {
    return text.substring(0, length) + '...'
  }
  return text
}

export function getAcceptFileExt(exts = SUPPORTED_EXTENSIONS) {
  let accept = ''
  exts.forEach((ext) => {
    accept += `.${ext},`
  })
  return accept
}

export function urlsToFiles(urls) {
  const promises = urls.map((url) => {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const filename = url.substring(url.lastIndexOf('/') + 1)
        return new File([blob], filename, { type: 'image/png' })
      })
  })
  return Promise.all(promises)
}

export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

export function formatNumberToK(number) {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + 'B'
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + 'M'
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + 'K'
  } else {
    return number.toString()
  }
}

export function removeHtmlTags(input) {
  return input.replace(/<\/?[^>]+(>|$)/g, '')
}

export async function downloadImg(url) {
  const image = await fetch(url)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)
  const ext = url?.split('.')
  const link = document.createElement('a')
  link.href = imageURL
  link.download = `Art-AI-Tomiru-${moment().format('YYYY-MM-DD-HH:mm:ss')}.${ext[ext.length - 1]}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function removeAllHtmlTags(string) {
  return string.replace(/(<([^>]+)>)/gi, "");
}
