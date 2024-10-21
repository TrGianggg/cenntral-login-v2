<template>
  <div class="maintenance-wrapper">
    <div class="maintenance-container text-white">
      <div class="lg:w-1/2 w-full flex flex-col items-center text-center">
        <img v-if="isDark"
            style="max-width: 187px"
            src="@/assets/logo.png"
            alt="logo-main"
        />
        <img v-else
             style="max-width: 187px"
             src="@/assets/logo-light.png"
             alt="logo-main"
        />
        <div class="maintenance-title text-primary-color section-title">
          Thông báo bảo trì hệ thống
        </div>
        <div class="md:text-[25px] text-[14px] mb-4">
          Thân gửi cộng đồng Tomiru,
        </div>
        <div class="md:text-[25px] text-[14px]">
          Nhằm nâng cao hiệu năng Tomiru, đội ngũ kỹ thuật sẽ
          thực hiện bảo trì và hoàn thiện thêm nhưng tính năng mới.
        </div>
        <div class="time-maintenance md:my-10 my-4">
          Thời gian dự kiến: {{ VITE_BASE_START_TIME_MAINTENANCE }} - {{ VITE_BASE_END_TIME_MAINTENANCE }}
        </div>
        <div class="md:text-[20px] text-[14px]">
          <div>
            Trong khoảng thời gian này, người dùng sẽ không truy cập được vào
            <a href="https://app.tomiru.com/"
               class="text-primary-color-only hover:underline">app.tomiru.com</a>.
          </div>
          <div>
            <span class="font-bold">Lưu ý</span>: Việc bảo trì lần này sẽ tạo thuận lợi và khác biệt nhất để thành viên TOMIRU hỗ trợ, giúp đỡ nhau cùng thành công.
            Hãy cùng TOMIRU tỏa sáng và tạo nên sự khác biệt.
          </div>
          <div class="mb-6">
            Kính mong quý cộng đồng thông cảm.
          </div>
          <div>
            Trân trọng,
          </div>
          <div>
            Đội ngũ Tomiru.
          </div>
        </div>
      </div>
    </div>
    <img src="@/assets/images/maintenance.png"
         alt="" class="-mt-12 image-mobile">
  </div>
</template>

<script setup>
import router from "@/router";
import {useThemeStore} from "@/stores/themeStore";
import {computed} from "vue";

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDarkStore)

const VITE_BASE_IS_MAINTENANCE = import.meta.env.VITE_BASE_IS_MAINTENANCE;
const VITE_BASE_START_TIME_MAINTENANCE = import.meta.env.VITE_BASE_START_TIME_MAINTENANCE;
const VITE_BASE_END_TIME_MAINTENANCE = import.meta.env.VITE_BASE_END_TIME_MAINTENANCE;
if (VITE_BASE_IS_MAINTENANCE !== '1') {
  router.push({ name: 'feed' })
}
</script>

<style lang="scss" scoped>
@import "@/design/variable";
.maintenance-container {
  padding: 60px;
  overflow: auto;
  .maintenance-title {
    font-size: 70px;
    //color: #FBC718;
    padding: 43px 0;
    font-weight: 700;
  }
  .time-maintenance {
    background: #F9B00D;
    font-size: 31px;
    color: var(--text-maintenance-color);
    padding: 0 32px;
    min-height: 62px;
    display: flex;
    align-items: center;
    border-radius: 23px;
    font-weight: 600;
  }
}
@media (min-width: 1200px) {
  .maintenance-container {
    height: 100vh;
    background: url("../assets/images/maintenance.png") no-repeat;
    background-position: right;
    background-size: contain;
  }
  .image-mobile {
    display: none;
  }
}
@media (max-width: 1199px) {
  .image-mobile {
    display: block;
  }
}
@media (max-width: 1024px) {
  .maintenance-container {
    padding: 15px;
    .maintenance-title {
      font-size: 35px;
      padding: 20px 0;
    }
    .time-maintenance {
      padding: 15px;
      font-size: 15px;
    }
  }
}
</style>