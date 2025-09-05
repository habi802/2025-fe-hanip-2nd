<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
    <header>
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
}

main {
    padding-top: 90px;
}
</style>
