<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const managerPath = import.meta.env.VITE_MANAGER_PATH;
</script>

<template>
    
    <div id="sidebar" class="d-flex flex-column position-fixed vh-100 bg-light p-3">
        <div class="text-center mb-4">
            <a :href="`/hanip${managerPath}`"><img class="logo" src="@/assets/manager/logo.png" /></a>
        </div>
        <ul class="nav nav-pills flex-column">
            <li class="nav-item"><a :href="`/hanip${managerPath}`" :class="`nav-link ${route.path === managerPath ? 'active' : ''}`">대시보드</a></li>
            <li class="nav-item"><a :href="`/hanip${managerPath}/user`" :class="`nav-link ${route.path === `${managerPath}/user` ? 'active' : ''}`">회원 관리</a></li>
            <li class="nav-item"><a :href="`/hanip${managerPath}/store`" :class="`nav-link ${route.path === `${managerPath}/store` ? 'active' : ''}`">가게 관리</a></li>
            <li class="nav-item"><a :href="`/hanip${managerPath}/order`" :class="`nav-link ${route.path === `${managerPath}/order` ? 'active' : ''}`">주문 관리</a></li>
            <li class="nav-item"><a :href="`/hanip${managerPath}/review`" :class="`nav-link ${route.path === `${managerPath}/review` ? 'active' : ''}`">리뷰 관리</a></li>
            <!-- <li class="nav-item"><a :href="`/hanip${managerPath}/recommand`" :class="`nav-link ${route.path === `${managerPath}/recommand` ? 'active' : ''}`">추천 관리</a></li> -->
            <li class="nav-item"><a :href="`/hanip${managerPath}/stats`" :class="`nav-link ${route.path === `${managerPath}/stats` ? 'active' : ''}`">통계 현황</a></li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
#sidebar {
    width: 275px;
}

.logo {
    width: 165px;
    height: 75px;
}

.nav-link {
    color: #E65558;
}

.nav-link.active {
    background-color: #E65558;
    color: white;
}
</style>