<template>
  <div>
    <img
      class="icon-dark"
      src="@/assets/icons/ai-art/icon-upscale.svg"
      alt=""
    />
    <img
      class="icon-light w-6"
      src="@/assets/icons/ai-art/icon-upscale-light.svg"
      alt=""
    />
  </div>
</template>
<script setup></script>
<style lang="scss">
.dark-theme {
  .icon-dark {
    display: flex;
  }

  .icon-light {
    display: none;
  }
}

.light-theme {
  .icon-dark {
    display: none;
  }

  .icon-light {
    display: flex;
  }
}
</style>
