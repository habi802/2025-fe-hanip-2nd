<script setup>
import Header from "@/components/customer/Header.vue";
import HeaderMini from "@/components/customer/HeaderMini.vue";
import Footer from "@/components/customer/Footer.vue";
import '@/assets/customer/customer.css';
</script>

<template>
    <!-- 헤더 (작은 화면에서만 보임) -->
    <header class="d-lg-none bg-white sticky-top">
        <HeaderMini />
    </header>

    <!-- 헤더 (큰 화면에서만 보임) -->
    <header class="d-none d-lg-block bg-white sticky-top">
        <Header />
    </header>
    
    <!-- 메인 -->
    <main>
        <RouterView />
    </main>

    <!-- 푸터 -->
    <footer>
        <Footer />
    </footer>
</template>

<style scoped>
header {
    box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
    width: 100%;
    height: 90px;
}

/* main {
    padding-top: 90px;
} */
</style>
