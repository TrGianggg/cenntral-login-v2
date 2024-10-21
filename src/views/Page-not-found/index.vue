<template>
  <section class="page_404">
    <div class="m-auto">
      <div class="four_zero_four_bg">
        <h1 class="text-center text-heading-2 mb-0 text-primary-color">404</h1>
        <p class="text-5xl text-primary-0 !mb-6 uppercase">Page not found</p>
      </div>
      <router-link
        to="/"
        class="flex"
      >
        <a-button
          type="primary"
          class="text-center m-auto"
          style="font-family: 'Inter', sans-serif !important"
          >Go to Home</a-button
        >
      </router-link>
    </div>
  </section>
</template>
<script>
export default {
  name: 'PageNotFound'
}
</script>
<style lang="scss">
.page_404 {
  font-family: 'Arvo', serif;
  height: 100vh;
  display: flex;
  width: 100%;
  border-left: 1px solid #1a1a1a;
  border-right: 1px solid #1a1a1a;
}

.page_404 img {
  width: 100%;
}

.four_zero_four_bg h1 {
  font-size: 80px;
}

.four_zero_four_bg h3 {
  font-size: 80px;
}

.link_404 {
  color: #fff !important;
  padding: 10px 20px;
  background: #39ac31;
  margin: 20px 0;
  display: inline-block;
}
.contant_box_404 {
  margin-top: -50px;
}
</style>
