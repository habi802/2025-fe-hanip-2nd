<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import CustomerLayout from './layouts/CustomerLayout.vue';

const route = useRoute();

const layout = computed(() => {
    return route.meta.layout || CustomerLayout;
});

// 로그인 체크 확인용
import { check } from './services/userService';
import { useAccountStore } from './stores/account';

const account = useAccountStore();

const checkAcconut = async () => {
    const res = await check();
    //console.log('res:', res);

    if (res == undefined || res.status != 200) {
        account.setChecked(false);
        return;
    }

    account.setChecked(true);
    account.setLoggedIn(res.data.resultData > 0);
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