import { aiArtStore } from '@/stores/ai-art'
import SpareICon from '@/assets/images/ai-art/square-icon.svg'
import PotraitICon from '@/assets/images/ai-art/potrait-icon.svg'
import Landscape from '@/assets/images/ai-art/landscape-icon.svg'
import MediumQualityICon from '@/assets/images/ai-art/medium-quality.svg'
import HighQualityICon from '@/assets/images/ai-art/high-quality.svg'
import SuperiorlityICon from '@/assets/images/ai-art/superior-quality.svg'

export const MAX_SIZE_IMG_UPLOAD = 5
export const MIN_ROWS_TEXT_AREA = 1
export const MAX_ROWS_TEXT_AREA = 5
export const SCREEN_LAPTOP = 1366
export const SCREEN_TABLET = 1024
export const SCREEN_MOBILE = 450

export const FAKE_DATA_CHOOSE_OPTION_DEFAULT = [
  {
    id: 0,
    name: 'Tỉ lệ ảnh',
    options: [
      {
        id: 1,
        name: 'Vuông',
        url: SpareICon,
        thumbnail_url: 'https://i.imgur.com/hGmkxsG.png',
        keyOption: '1:1'
      },
      {
        id: 2,
        name: 'Chân dung',
        url: PotraitICon,
        thumbnail_url: 'https://i.imgur.com/hGmkxsG.png',
        keyOption: '2:3'
      },
      {
        id: 3,
        name: 'Phong cảnh',
        url: Landscape,
        thumbnail_url: 'https://i.imgur.com/hGmkxsG.png',
        keyOption: '3:2'
      }
    ]
  },
  {
    id: 25,
    name: 'Chất lượng ảnh',
    options: [
      {
        id: '.25',
        name: 'Trung bình',
        url: MediumQualityICon,
        thumbnail_url: 'https://imgur.com/uiIONw5.png',
        keyOption: '.25'
      },
      {
        id: '.5',
        name: 'Cao',
        url: HighQualityICon,
        thumbnail_url: 'https://imgur.com/hfF0X5L.png',
        keyOption: '.5'
      },
      {
        id: '1',
        name: 'Tối đa',
        url: SuperiorlityICon,
        thumbnail_url: 'https://imgur.com/2VMGPXx.png',
        keyOption: '1'
      }
    ]
  }
]

export const STATUS_RESPONSE = {
  PENDING: 0,
  CANCEL: 3
}
export const FAKE_DATA_IMG_RENDER = [
  {
    name: 'img render 1',
    url: 'https://i.imgur.com/YoPNBcS.png'
  },
  {
    name: 'img render 2',
    url: 'https://i.imgur.com/doiZCcM.png'
  },
  {
    name: 'img render 3',
    url: 'https://i.imgur.com/2iXvJe9.png'
  },
  {
    name: 'img render 4',
    url: 'https://i.imgur.com/5r5Wv0k.png'
  }
]

export const TYPE_GEN = {
  ART: 'art',
  AVATAR: 'avatar'
}
export const ART_AI = {
  PARENT_ID: 1,
  TYPE: {
    DEFAULT: 1,
    VARIANT: 2,
    UPSCALE: 3
  },
  ASPECTRATIO: {
    SQUARE: '1:1'
  },
  LIST_RATIO: {
    1: {
      name: 'Vuông',
      aspectRatio: '1:1'
    },
    2: {
      name: 'Chân dung',
      aspectRatio: '2:3'
    },
    3: {
      name: 'Phong cảnh',
      aspectRatio: '3:2'
    }
  },
  IMAGEPOSITION: [null, 1, 2, 3, 4],
  COUNTER_CALL_API: 20,
  TIME_MESSAGE: 5000,
  QUALITY: {
    MEDIUM: '.25',
    HIGH: '.5',
    SUPERIOR: '1'
  }
}

export function checkBodyInteractions(type, body) {
  let status = { code: 200, text: 'success' }
  if (type === ART_AI.TYPE.DEFAULT) {
    if (body?.content === '' || body?.content === undefined) {
      status = { code: 0, text: 'Please enter text content' }
    } else if (body?.aspectRatio === undefined) {
      status = { code: 0, text: 'Please enter aspect ratio' }
    }
  } else if (type === ART_AI.TYPE.UPSCALE || type === ART_AI.TYPE.VARIANT) {
    if (body?.parentId === undefined) {
      status = { code: 0, text: 'Not parentId' }
    } else if (body?.imagePosition === undefined) {
      status = { code: 0, text: 'Not image position' }
    }
  }
  return status
}

export function handlesOptionPending(body) {
  return { ...body }
}

export function resetHashTag() {
  aiArtStore().handlesSetOptionChoosePending([
    {
      id: 1,
      name: 'Vuông',
      keyOption: '1:1',
      keyIdC: 0,
      keyIdP: 0,
      typeChoose: 'Default',
      activeBtn: true
    },
    {
      id: '.25',
      name: 'Trung bình',
      keyOption: '.25',
      keyIdC: 0,
      keyIdP: 1,
      typeChoose: 'Medium',
      activeBtn: true
    }
  ])
}

export function convertNameTag(key) {
  let res = ''
  FAKE_DATA_CHOOSE_OPTION_DEFAULT.forEach((item) => {
    item.options.forEach((itemC) => {
      if (itemC.keyOption === key) {
        res = itemC.name
      }
    })
  })
  return res
}

export function convertHashTagUpVa(item) {
  const temp = []
  temp.push({ ...item, name: convertNameTag(item.aspectRatio) })
  temp.push({ ...item, name: convertNameTag(item.quality) })
  if (item.properties.length !== 0) {
    return [...temp, ...item.properties]
  } else {
    return [...temp]
  }
}

export function prevHandlesType_Property(optionChoose) {
  if (optionChoose?.length === 0) {
    return {
      properties: [],
      aspectRatio: ART_AI.ASPECTRATIO.SQUARE,
      quality: ART_AI.QUALITY.MEDIUM
    }
  } else {
    return {
      properties: optionChoose
        .map((item) => item.id)
        .splice(2, optionChoose.length)
        .filter((item) => item !== 0),
      aspectRatio: ART_AI.LIST_RATIO[optionChoose[0].id]
        ? ART_AI.LIST_RATIO[optionChoose[0].id].aspectRatio
        : '1:1',
      quality: optionChoose[1].id
    }
  }
}

export function resizeHeightBlockStepTwo() {}

export const getMobileOperatingSystem = () => {
  try {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    if (/android/i.test(userAgent)) {
      return 'android'
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window?.MSStream) {
      return 'ios'
    }
    return 'unknown'
  } catch (error) {
    return 'unknown'
  }
}

export const LIST_CONTENT_GEN_AVATAR = [
  'Futuristic Identity Makeover: Transform into a digital pioneer by personalizing my avatar with cybernetic enhancements, vibrant neon colors, and cutting-edge virtual reality gear, mirroring my original image.',
  'Metaverse Adventure Chic: Embark on a metaverse journey with an avatar featuring glowing circuitry, augmented reality glasses, and a hoverboard for seamless navigation, capturing the essence of my original image.',
  'Dystopian Cyberpunk Hero: Craft a cyberpunk hero avatar with metallic enhancements, glowing eyes, and a powerful energy weapon, ready for a high-tech adventure while staying true to my original image.',
  'Edgy Futuristic Trends: Embrace the latest avatar trends with cybernetic limbs, holographic tattoos, and interactive nanotechnology fashion, creating a unique digital representation faithful to my original image.',
  'Cybernetic Utopia Persona: Build a futuristic digital persona with neural interface implants, levitating drones, and bio-luminescent skin patterns, ensuring an accurate depiction of my original features.',
  'Bioengineered Wonders Avatar: Explore bioengineering in avatar creation with enhanced abilities like bioluminescent hair, retractable wings, and glowing DNA patterns, all faithful to my original selfie.',
  'AI-Tech Fusion Being: Merge human and machine elements to create a cybernetic being with superhuman intelligence, closely resembling my facial features from the original selfie.',
  'Digital Influencer Avatar: Become a trendsetting digital influencer with holographic garments, LED-lit accessories, and customizable robotic companions, ensuring a striking similarity to my original image.',
  'Cosmic Explorer Avatar: Embark on a cosmic journey with a space-faring avatar equipped with a sleek spacesuit, futuristic propulsion systems, and a holographic star map, capturing the essence of my original image.',
  'Cyber-Samurai Quest: Customize my avatar as a cyber-samurai warrior with detailed augmented reality armor, plasma blades, and advanced stealth technology, ready to face futuristic challenges while maintaining the likeness of my original selfie.'
]
