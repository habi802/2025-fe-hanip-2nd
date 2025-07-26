<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <Header class="header" />
  <div class="router">
    <RouterView />
  </div>
  <Footer />
</template>

<style scoped>
.header {
  position: fixed;
  z-index: 9999;
}
.router {
  padding-top: 90px;
}
</style>
