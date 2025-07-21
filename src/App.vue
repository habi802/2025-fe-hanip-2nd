<script setup>
import Header from '@/components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <Header></Header>
  <router-view />
  <Footer></Footer>
  <RouterLink to="/store/review">업주페이지</RouterLink>
</template>

<style scoped></style>
