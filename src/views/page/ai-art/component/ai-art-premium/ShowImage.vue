<template>
  <div>
    <div class="form-image">
      <img
        :class="listClass"
        :src="sourceImage"
        loading="lazy"
        alt=""
      />
    </div>
  </div>
</template>
<script>
export default {
  props: ['sourceImage', 'listClass'],
  data() {
    return {
      imgSrc: '',
      loading: false
    }
  },
  mounted() {
    const myImage = new Image()
    myImage.src = this.sourceImage
    this.loading = true
    myImage.onload = () => {
      this.loading = false
    }
  }
}
</script>
<style scoped lang="scss"></style>
