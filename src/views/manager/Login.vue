<script setup>
import '@/assets/manager/manager.css'

import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { managerLogin } from '@/services/managerService';
import AlertModal from '@/components/modal/AlertModal.vue';
import LoadingModal from '@/components/modal/LoadingModal.vue';

const router = useRouter();
const managerPath = import.meta.env.VITE_MANAGER_PATH;

const state = reactive({
    form: {
        loginId: '',
        loginPw: ''
    }
});

const alertModalRef = ref(null);
const loadingModalRef = ref(null);

const submit = async () => {
    //const res = await managerLogin(state.form);

    router.push({ path: managerPath });
    loadingModalRef.value.open();
};
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
                    <b-form-input type="text" id="admin-login-id" v-model="state.form.loginId"></b-form-input>
                </div>
                <div class="mb-3">
                    <label for="admin-login-pw" class="form-label">비밀번호</label>
                    <b-form-input type="password" id="admin-login-pw" v-model="state.form.loginPw"></b-form-input>
                </div>
                <button type="submit" class="btn btn-primary">로그인</button>
            </form>
        </b-container>

        <AlertModal ref="alertModalRef" />
        <LoadingModal ref="loadingModalRef" />
    </div>
</template>

<style lang="scss" scoped>
.logo {
    width: 50%;
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