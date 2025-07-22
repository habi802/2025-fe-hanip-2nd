<script setup>
import MainLayout from './layouts/MainLayout.vue';
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const layout = computed(() => {
  return route.meta.layout || MainLayout;
});
// 로그인 체크 확인용
import { check } from './services/userService';
import { useAccountStore } from './stores/account';

const account = useAccountStore();

const checkAcconut = async () => {
  const res = await check();
  if (res == undefined || res.status != 200) {
    account.setChecked(false);
    return;
  }
  account.setChecked(true);
  account.setLoggedIn((res.status = 200));
};
onMounted(() => {
  checkAcconut();
});
watch(
  () => route.path,
  () => {
    checkAcconut();
  }
);
</script>
<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<style scoped></style>
