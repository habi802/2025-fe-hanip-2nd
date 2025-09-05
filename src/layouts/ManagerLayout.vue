<script setup>
import LogoutButton from '@/components/manager/LogoutButton.vue';
import Sidebar from '@/components/manager/Sidebar.vue';
import Header from '@/components/manager/Header.vue';
</script>

<template>
    <div class="container-fluid p-0">
        <!-- 햄버거 버튼, 로그아웃 버튼 (작은 화면에서만 보임) -->
        <div class="border-bottom d-md-none sticky-top bg-white d-flex justify-content-between align-items-center px-3">
            <button class="hamburger btn m-2" type="button"
                    data-bs-toggle="offcanvas" data-bs-target="#sidebar"
                    aria-controls="sidebar">
                ☰
            </button>
            <LogoutButton />
        </div>

        <div class="row flex-nowrap g-0">
            <!-- 사이드바 -->
            <div id="sidebar" class="offcanvas-md offcanvas-start d-md-flex bg-light" tabindex="-1">
                <Sidebar />
            </div>
            
            <!-- 헤더(큰 화면에서만 보임), 메인 컨텐츠 -->
            <div class="col">
                <header class="border-bottom sticky-top bg-white d-none header-block">
                    <Header />
                </header>

                <main class="col py-3 ms-0">
                    <RouterView />
                </main>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.hamburger {
    border-color: #FF6666;
    color: #FF6666;

    &:hover {
        background-color: #FF6666;
        color: white;
    }
}

.header-block {
    @media (min-width: 768px) {
        display: block !important;
    }
}

#sidebar {
    width: 275px;
}
</style>