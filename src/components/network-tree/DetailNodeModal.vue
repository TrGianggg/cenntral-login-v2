<template>
  <a-modal
    v-model:visible="visible"
    :footer="null"
    :width="1000"
    wrap-class-name="cs-modal network-modal"
    :afterClose="handleModalAfterClose"
  >
    <div class="network-modal-container">
      <a-tabs v-model:active-key="activeKey">
        <a-tab-pane
          tab="Thông tin chi tiết user"
          key="info"
        ></a-tab-pane>
        <a-tab-pane
          tab="Mạng lưới user"
          key="network"
        ></a-tab-pane>
      </a-tabs>
      <div class="bg-neutral-850 p-8 flex justify-center min-h-[400px] w-full">
        <div
          v-if="selectedNode && activeKey === 'info'"
          class="flex flex-col gap-5 text-white max-w-[600px] w-full"
        >
          <div class="text-heading-3 text-white font-bold">
            {{ getFullNameUser(selectedNode) }}
          </div>
          <div class="grid grid-cols-2">
            <div>
              <div class="px-3 py-2 rounded-full label-item">Họ tên</div>
            </div>
            <div class="flex items-center">{{ getFullNameUser(selectedNode) }}</div>
          </div>
          <div class="border-b"></div>
          <div class="grid grid-cols-2">
            <div>
              <div class="px-3 py-2 rounded-full label-item">Username</div>
            </div>
            <div class="flex items-center">@{{ selectedNode.username }}</div>
          </div>
          <div class="border-b"></div>
          <div class="grid grid-cols-2">
            <div>
              <div class="px-3 py-2 rounded-full label-item">Ngày đăng ký</div>
            </div>
            <div class="flex items-center">{{ formatFullTime(selectedNode.buyPackageAt) }}</div>
          </div>
          <div class="border-b"></div>
          <div class="grid grid-cols-2">
            <div>
              <div class="px-3 py-2 rounded-full label-item">Quan hệ</div>
            </div>
            <div class="flex items-center">
              {{ selectedNode.isF1 ? 'F1' : 'non-F1' }}
            </div>
          </div>
          <div class="border-b"></div>
          <div
            v-if="selectedNode.usersBalances"
            class="grid grid-cols-2"
          >
            <div>
              <div class="px-3 py-2 rounded-full label-item">Số dư</div>
            </div>
            <div class="flex flex-col gap-4 pt-1">
              <div
                v-for="(item, index) in selectedNode.usersBalances"
                :key="index"
                class="flex gap-2"
              >
                <span>{{ formatNumber(item.balance) }}</span>
                <span>{{ item.token.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="selectedNode && activeKey === 'network'"
          class="w-full"
        >
          <NetworkTreeChart
            @on-click="handleChartClick"
            :height="550"
            :selected-node="selectedNode"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import { ref } from 'vue'
import NetworkTreeChart from '@/components/network-tree/NetworkTreeChart.vue'
import { formatFullTime, formatNumber, getFullNameUser } from '@/helper/ultil'

const visible = ref(false)
const selectedNode = ref({})
const activeKey = ref('info')
const open = (nodeDetail) => {
  visible.value = true
  selectedNode.value = nodeDetail
}

const handleModalAfterClose = () => {
  activeKey.value = 'info'
}

const handleChartClick = (node) => {
  selectedNode.value = node
  activeKey.value = 'info'
}

defineExpose({
  open
})
</script>

<style lang="scss">
@import '@/design/variable.scss';
.network-modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .ant-tabs {
    width: 600px;
  }
  .ant-tabs-nav {
    margin-bottom: 0;
    border-radius: 0;
    background: $neutral-900;
  }
  .label-item {
    background: rgba(240, 196, 40, 0.1);
    color: #f0c428;
    display: inline-block;
    font-size: 14px;
  }
}
.light-theme {
  .network-modal-container {
    .label-item {
      background: #f0c428;
      color: var(--color-white);
      display: inline-block;
      font-size: 14px;
    }
  }
}
@media (max-width: 768px) {
  .network-modal-container {
    .ant-tabs {
      width: 100%;
    }
  }
}
</style>
