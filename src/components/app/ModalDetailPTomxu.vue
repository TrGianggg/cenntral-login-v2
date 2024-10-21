<template>
  <a-modal
    wrapClassName="modal-share-fund"
    v-model:visible="states.visible"
  >
    <div>
      <div class="flex flex-row items-center gap-3 pb-4">
        <IconHelp type="black"></IconHelp>
        <span class="text-body-1 font-bold">{{ $t('tomxu.what_p_tomxu') }}</span>
      </div>
      <ul class="flex flex-col gap-1.5 list-disc pl-5 text-body-3">
        <li>
          <strong>P</strong> là thưởng hoàn phí khi thành viên trong mạng lưới của bạn mua gói thành
          viên Tomiru. Bạn có thể yêu cầu chuyển đổi thành <strong>CP</strong> khi trở thành thành
          viên của Tomiru và giới thiệu được từ 03 thành viên trở lên trong tháng ở chu kỳ đầu tiên
          hoặc từ 01 thành viên trở lên ở các chu kỳ tiếp theo.
        </li>
        <li>
          Nếu trong vòng 30 ngày tính từ thời điểm hết hạn của gói thành viên gần nhất, bạn không
          gia hạn(mua lại gói) <span>&#10140;</span> số dư <strong>P</strong> còn lại trong tài
          khoản sẽ bị thu hồi.
        </li>
        <li>
          Toàn bộ <strong>P</strong> bị thu hồi sẽ được chuyển thành <strong>CP</strong> và chuyển
          về 4 qũy đồng chia theo tỷ lệ <strong>10%-20%-30%-40%</strong>.
        </li>
      </ul>
    </div>
  </a-modal>
  <p
    class="text-primary-color text-body-5 cursor-pointer underline underline-offset-4"
    @click="
      () => {
        states.visible = true
      }
    "
  >
    ({{ $t('common.detail') }})
  </p>
</template>
<script setup>
import { reactive } from 'vue'
import IconHelp from '@/components/shared/icons/IconHelp.vue'

const states = reactive({
  visible: false
})
</script>
