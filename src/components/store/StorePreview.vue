<template>
  <div class="w-full mt-5 text-center px-10">
    <h1 class="text-4xl font-semibold leading-tight px-5 mb-5">
      Trang web bán hàng tiện dụng của TOMIRU
    </h1>
    <p class="text-lg mb-5">
      Chúng tôi tự hào giới thiệu bộ sưu tập nước giặt, nước xả, dầu gội, nước xịt thơm, và nhiều
      sản phẩm khác trong danh mục chăm sóc gia đình của chúng tôi. Với các công thức cải tiến và
      được thiết kế đặc biệt để đáp ứng mọi nhu cầu của bạn, sản phẩm của chúng tôi không chỉ mang
      lại hiệu quả vượt trội trong việc làm sạch và chăm sóc, mà còn giúp mang lại cảm giác thoải
      mái và sảng khoái cho cả gia đình bạn.
    </p>
    <img
      src="@/assets/images/store-preview.jpg"
      alt="store-preview"
      class="mb-8"
    />
    <a-button
      type="primary"
      block
      shape="round"
      @click="navigateShop"
      class="text-lg"
      >Truy cập ngay !</a-button
    >
  </div>
</template>
zc v
<script setup>
import { getToken, getHashTokenShop } from '../../helper/http/cookie'
const tokenApp = getToken()
const hashTokenShop = getHashTokenShop()
const url = `${import.meta.env.VITE_BASE_SHOP_URL}/?tokenapp=${tokenApp}&hashtokenshop=${hashTokenShop}`
const navigateShop = () => {
  window.open(url, '_blank')
}
</script>
<style lang="scss"></style>
