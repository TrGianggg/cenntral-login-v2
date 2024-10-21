<template>
  <div class="w-full rounded-xl overflow-hidden shadow-light">
    <v-chart v-if="rootAvatar && userInfo && dataTree && dataTree.email"
             class="chart"
             :style="{
                height: `${height}px`
             }"
             :option="optionComputed"
             @click="handleChartClick" />
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { TreeChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import {ref, provide, computed, watch} from "vue";
import {ternaryTreeApi, ternaryTreeByUsernameApi} from "@/api/network";
import {userStore} from "@/stores/userStore";
import {useThemeStore} from "@/stores/themeStore";
const emit = defineEmits(['on-click'])
use([
  CanvasRenderer,
  TreeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

provide(THEME_KEY, "dark");

const { selectedNode } = defineProps({
  selectedNode: {
    type: Object,
    default() {
      return null
    }
  },
  height: {
    type: Number,
    default: 700
  }
})
const store = userStore();
const userInfo = computed(() => {
  return store.userInfo
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDarkStore)

function cropImageToCircle(imageUrl, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.beginPath();
  context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
  context.clip();

  const image = new Image();
  image.src = imageUrl;

  return new Promise((resolve) => {
    image.onload = function () {
      try {
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        return resolve('/default-avatar-circle.png')
      }
    };
  });
}

const dataTree = ref({})
const fetchDataTree = () => {
  if (selectedNode) {
    ternaryTreeByUsernameApi(selectedNode.username).then(resp => {
      handleGetTree(resp)
    })
  } else {
    ternaryTreeApi().then(resp => {
      handleGetTree(resp)
    })
  }
}

const updateTree = (node) => {
  if (node.isF1) {
    node.itemStyle = {
      color: '#d1b554',
    }
  }
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      updateTree(child);
    }
  }
}

watch(isDark, () => {
  fetchDataTree()
})
const handleGetTree = (resp) => {
  const labelNodeRoot = {
    position: [35, -20],
        verticalAlign: 'middle',
        align: 'center',
        fontSize: 24,
        formatter: (params) => {
      return `${params.data.firstName} ${params.data.lastName}`
    },
    color: isDark.value ? '#A1A1A1' : '#000'
  }
  if (resp.trees && resp.trees.length) {
    dataTree.value = {
      ...resp.trees[0],
      root: true,
      label: labelNodeRoot,
    };
    updateTree(dataTree.value)
  } else {
    dataTree.value = {
      floor: 1,
      email: userInfo.value.email,
      firstName: userInfo.value.firstName,
      lastName: userInfo.value.lastName,
      username: userInfo.value.username,
      refCode: userInfo.value.refCode,
      isF1: false,
      root: true,
      label: labelNodeRoot,
    }
  }
}

const avatarUrl = ref('/default-avatar.png')
const rootAvatar = ref('')
watch(userInfo, (userInfo) => {
  if (userInfo && userInfo.email) {
    avatarUrl.value = userInfo.profileImage || '/default-avatar.png';
    cropImageToCircle(avatarUrl.value, 500, 500).then((croppedImageUrl) => {
      rootAvatar.value = croppedImageUrl;
    });
    fetchDataTree();
  }
}, { immediate: true })
const windowWidth = window.innerWidth;
const optionComputed = computed(() => {
  return  {
    backgroundColor: isDark.value ? '#141414' : '#fff',
    tooltip: windowWidth > 1024 ? {
      formatter: (params) => {
        return `${params.data.firstName} ${params.data.lastName} <br> (${params.data.email})`
      }
    } : false,
    series: [
      {
        type: 'tree',
        data: [dataTree.value],
        left: '2%',
        right: '2%',
        top: '18%',
        bottom: '5%',
        // zoom: 1.3,
        symbol: (value, params) => {
          const isRootUser = params.data.root;
          return isRootUser ? `image://${rootAvatar.value}` : 'circle'
        },
        orient: 'vertical',
        roam: true,
        symbolSize: (value, params) => {
          const isRootUser = params.data.root;
          return isRootUser ? 70 : 45
        },
        initialTreeDepth: 4, // số level hiển thị tree
        expandAndCollapse: false,
        scaleLimit: {
          min: 0.1,
          max: 4
        },
        lineStyle: {
          color: '#B3B3B3',
          type : 'solid',
          curveness: 0
        },
        itemStyle: {
          color: '#A1A1A1', // #A1A1A1 nếu empty
        },
        label: {
          verticalAlign: 'middle',
          align: 'center',
          fontSize: 14,
          formatter: (params) => {
            const sortUsername = params.data.username.length > 3
                ? params.data.username.substring(0, 3) + '...'
                : params.data.username
            return params.data.username ? sortUsername : ''
          }
        },
        leaves: {
          label: {
            verticalAlign: 'middle',
            align: 'center'
          }
        },
        animationDurationUpdate: 750
      }
    ]
  }
})

const handleChartClick = (data) => {
  if (data.data.root) return;
  emit('on-click', data.data)
}
</script>