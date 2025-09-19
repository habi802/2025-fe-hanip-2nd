<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/account';
import { logout } from '@/services/userService';
import LoadingModal from '@/components/modal/LoadingModal.vue';

const router = useRouter();
const account = useAccountStore();
const managerPath = import.meta.env.VITE_MANAGER_PATH;

const loadingModalRef = ref(null);

const signOut = async () => {
    loadingModalRef.value.open();

    const res = await logout();

    if (res !== undefined || res.status === 200) {
        account.setLoggedIn(false);
        router.push({ path: `${managerPath}/login` });
    }

    loadingModalRef.value.hide();
};
</script>

<template>
    <button class="logout btn" type="button" @click="signOut">로그아웃</button>

    <LoadingModal ref="loadingModalRef" />
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