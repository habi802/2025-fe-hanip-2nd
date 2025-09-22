<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EmptyLayout from './layouts/EmptyLayout.vue';
// import AlertModal from './components/modal/AlertModal.vue';

const route = useRoute();

const layout = computed(() => {
    return route.meta?.layout || EmptyLayout;
});
</script>

<template>
    <component :is="layout">
        <router-view />
    </component>

    <!-- <AlertModal /> -->
</template>

<style scoped></style>