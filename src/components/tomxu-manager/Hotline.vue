<template>
  <a
    class="comp-hotline__desktop ring-hotline hidden xl:block cursor-default relative w-full !z-[1000] max-w-[268px]"
  >
    <img
      :src="BgHotline"
      alt="BgHotline"
    />
    <div class="h-full top-0 absolute flex w-full justify-end items-end p-3 pb-1">
      <p class="mb-0 text-black h-fit text-heading-3 font-cairo text-center w-full !font-bold">
        {{ hotline }}
      </p>
    </div>
  </a>
  <div
    class="comp-hotline__mobile ring-hotline relative xl:hidden w-full max-w-[174px] cursor-pointer"
  >
    <a :href="`tel:${hotline}`">
      <img
        :src="BgHotlineMobile"
        alt="BgHotline"
      />
    </a>
  </div>
</template>
<script setup>
import BgHotline from '@/assets/icons/tomxu/hotline-bg.png'
import BgHotlineMobile from '@/assets/icons/tomxu/hotline-mobile.png'
const hotline = import.meta.env.VITE_BASE_NUMBER_PHONE_HOTLINE
</script>
<style lang="scss">
@import '@/design/variable.scss';
.ring-hotline::before {
  content: '';
  width: 0;
  height: 0;
  border-radius: 100%;
  border: 8px solid $primary-color;
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ring 2s infinite;
  -webkit-animation: ring 1.5s infinite;
}

@keyframes ring {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
    border: 1px solid $primary-color;
  }
  70% {
    width: 200px;
    height: 200px;
    opacity: 0;
    display: none;
    border: 4px solid $primary-color;
  }
  100% {
    opacity: 0;
  }
}
</style>
