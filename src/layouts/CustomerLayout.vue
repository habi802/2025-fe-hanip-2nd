<script setup>
import Header from "@/components/customer/Header.vue";
import HeaderMini from "@/components/customer/HeaderMini.vue";
import Footer from "@/components/customer/Footer.vue";
</script>

<template>
    <!-- 헤더 (작은 화면에서만 보임) -->
    <header class="d-lg-none bg-white">
        <HeaderMini />
    </header>

    <!-- 헤더 (큰 화면에서만 보임) -->
    <header class="d-none d-lg-block bg-white">
        <Header />
    </header>
    
    <main>
        <RouterView />
    </main>

    <footer>
        <Footer />
    </footer>
</template>

<style scoped>
header {
    position: fixed;
    z-index: 9999;
    box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
    width: 100%;
    height: 90px;
}

main {
    padding-top: 90px;
}
</style>
