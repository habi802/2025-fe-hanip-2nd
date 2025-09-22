<script setup>
import '@/assets/manager/manager.css'

import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore, useUserInfo } from '@/stores/account';
import { managerLogin } from '@/services/managerService';
import AlertModal from '@/components/modal/AlertModal.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';

const router = useRouter();
const account = useAccountStore();
const user = useUserInfo();

const managerPath = import.meta.env.VITE_MANAGER_PATH;

const state = reactive({
    form: {
        loginId: '',
        loginPw: ''
    }
});

const alertModalRef = ref(null);
const loadingModalRef = ref(null);
const submitRef = ref(false);

const submit = async () => {
    loadingModalRef.value.open();

    submitRef.value = true;
    if (!state.form.loginId || !state.form.loginPw) {
        loadingModalRef.value.hide();
        return;
    }

    const res = await managerLogin(state.form);
    if (res !== undefined && res.status === 200) {
        account.setLoggedIn(true);
        user.fetchStore();
        router.push({ path: managerPath });
    }

    loadingModalRef.value.hide();
};

onMounted(() => {
    if (account.state.loggedIn && user.state.userData.role === '관리자') {
        router.push({ path: managerPath });
    }
});
</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <b-container>
            <div class="text-center mb-3">
                <img class="logo" src="@/assets/manager/logo.png" />
            </div>
            <form @submit.prevent="submit">
                <div class="mb-3">
                    <label for="admin-login-id" class="form-label">아이디</label>
                    <b-form-input type="text" id="admin-login-id" v-model="state.form.loginId" :state="submitRef ? (state.form.loginId.length > 0 ? true : false) : null"></b-form-input>
                    <b-form-invalid-feedback v-if="submitRef">아이디를 입력하세요.</b-form-invalid-feedback>
                </div>
                <div class="mb-3">
                    <label for="admin-login-pw" class="form-label">비밀번호</label>
                    <b-form-input type="password" id="admin-login-pw" v-model="state.form.loginPw" :state="submitRef ? (state.form.loginPw.length > 0 ? true : false) : null"></b-form-input>
                    <b-form-invalid-feedback v-if="submitRef">비밀번호를 입력하세요.</b-form-invalid-feedback>
                </div>
                <button type="submit" class="btn btn-primary">로그인</button>
            </form>
        </b-container>

        <AlertModal ref="alertModalRef" />
        <LoadingModal ref="loadingModalRef" />
    </div>
</template>

<style lang="scss" scoped>
.container {
    max-width: 450px;
}

.logo {
    width: 300px;
    height: 50%;
}

.btn-primary {
    background-color: #FF6666;
    border-color: #E65558;

    &:hover {
        background-color: #E55558;
    }
}
</style>