<template>
  <div class="card-statistics flex justify-between items-center md:mt-0 mt-1.5">
    <div class="card-statistic-item">
      <IconLike/>
      <span>{{ post.likesCount }}</span>
    </div>
    <div class="flex items-center gap-6">
      <div class="card-statistic-item">
        <IconComment/>
        <span>{{ post.commentsCount }}</span>
      </div>
      <div class="card-statistic-item">
        <IconShare/>
        <span>{{ post.sharesCount }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import IconComment from "@/components/shared/icons/IconComment.vue";
import IconLike from "@/components/shared/icons/IconLike.vue";
import IconShare from "@/components/shared/icons/IconShare.vue";

defineProps({
  post: {
    type: Object,
    default() {
      return null
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/design/variable.scss';
.card-statistics {
  height: 32px;
}
.card-statistic-item {
  display: flex;
  align-items: center;
  gap: 4px;
  svg {
    stroke: currentColor;
    fill: none;
  }
}
</style>

<style lang="scss">
.gi-modal-img {
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
@media (max-width: 1024px) {
  .gi-modal-img {
    top: 50% !important;
    transform: translateY(-50%);
  }
}
</style>