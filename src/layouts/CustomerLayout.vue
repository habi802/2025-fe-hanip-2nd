<script setup>
import Header from "@/components/customer/Header.vue";
import Footer from "@/components/customer/Footer.vue";
</script>

<template>
    <header class="d-flex align-items-center bg-white">
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
