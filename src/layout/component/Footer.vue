<template>
  <div class="wrap-layout-footer">
    <div class="layout-footer-content">
      <div class="flex justify-between w-full items-end">
        <div class="flex gap-x-11 gap-y-3 md:flex-row flex-col">
          <div class="flex flex-col gap-3">
            <router-link
              to=""
              class="text-white"
              >Giới thiệu</router-link
            >
            <router-link
              to=""
              class="text-white"
              >Đăng ký mở Đại Lý</router-link
            >
          </div>
          <div class="flex flex-col gap-3">
            <router-link
              to=""
              class="text-white"
              >Chính sách bảo mật</router-link
            >
            <router-link
              to=""
              class="text-white"
              >Chương trình tiếp thị liên kết Tomiru</router-link
            >
          </div>
        </div>
        <ListSocial width="24px" />
      </div>
      <div class="mt-10 pb-10 copy-right-text">© 2023 Tomiru. Tất cả các quyền được bảo lưu.</div>
    </div>
    <div class="footer-gradient"></div>
  </div>
</template>
<script setup>
import ListSocial from '@/components/app/ListSocial.vue'
</script>
<style lang="scss">
@import '@/design/variable';
.wrap-layout-footer {
  width: 100%;
  display: flex;
  min-height: $height-footer;
  flex-direction: column;
  margin: 0 auto;
  position: relative;
  z-index: 22;
  .layout-footer-content {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }
}
.footer-gradient {
  height: 1000px;
  background: linear-gradient(180deg, rgba(3, 11, 38, 0) 0%, #0b2474 100%);
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: -1;
  user-select: none;
}
.copy-right-text {
  color: rgba(255, 255, 255, 0.4);
}
@media (max-width: 1024px) {
  .wrap-layout-footer {
    padding: 0 1rem;
  }
}
</style>
