<script setup>
import MainLayout from './layouts/MainLayout.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const layout = computed(() => {
  return route.meta.layout || MainLayout;
});
</script>
<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<style scoped></style>
