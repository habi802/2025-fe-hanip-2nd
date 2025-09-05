<script setup>
import '@/assets/manager/manager.css'

import { reactive } from 'vue';

const state = reactive({
    form: {
        loginId: '',
        loginPw: ''
    }
});

const submit = () => {

};
</script>

<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <b-container>
            <div class="text-center mb-3">
                <img class="logo" src="@/assets/manager/logo.png" />
            </div>
            <form @sumbit.prevent="submit">
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