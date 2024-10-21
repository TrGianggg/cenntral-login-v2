<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
    <mask id="mask0_3415_6034" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21">
      <path d="M0 0.500002H20V20.5H0V0.500002Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_3415_6034)">
      <path d="M7 14.2488C5.94121 14.2688 4.93277 14.0281 4.03359 13.5684L0.585938 14.25L1.26758 10.8414C0.831641 9.98867 0.585938 9.02309 0.585938 8C0.585938 4.54805 3.42305 1.75 6.875 1.75C9.89922 1.75 12.4215 3.8977 13 6.75121" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.875 13C6.875 16.452 9.67305 19.25 13.125 19.25C14.148 19.25 15.1137 19.0043 15.9664 18.5684L19.4141 19.25L18.7324 15.8414C19.1684 14.9887 19.4141 14.023 19.4141 13C19.4141 9.54805 16.577 6.75 13.125 6.75C9.67305 6.75 6.875 9.54805 6.875 13Z" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 24
  }
})
</script>