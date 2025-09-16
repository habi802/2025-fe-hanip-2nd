<script setup>
import { useRouter } from 'vue-router';
import { logout } from '@/services/userService';

const router = useRouter();
const managerPath = import.meta.env.VITE_MANAGER_PATH;

const signOut = async () => {
    router.push({ path: `${managerPath}/login` })
};
</script>

<template>
    <button class="logout btn" type="button" @click="signOut">로그아웃</button>
</template>

<style lang="scss" scoped>
.logout {
    border-color: #B5B5B5;
    color: #B5B5B5;

    &:hover {
        background-color: #B5B5B5;
        color: white;
    }
}
</style>