<template>
  <div class="border p-4 rounded-xl my-4 flex gap-3">
    <IconPrivate :width="24"/>
    <div class="flex-1 min-w-0">
      <div class="font-semibold">Nội dung này không hiển thị</div>
      <div class="pt-1">
        Lỗi này thường do chủ sở hữu chỉ chia sẻ nội dung với một nhóm nhỏ hoặc đã xoá nội dung
      </div>
    </div>
  </div>
</template>
<script setup>
import IconPrivate from "@/components/shared/icons/IconPrivate.vue";
</script>