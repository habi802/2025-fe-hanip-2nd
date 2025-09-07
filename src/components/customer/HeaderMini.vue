<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useUserInfo, useAccountStore } from "@/stores/account";
import AlertModal from "../modal/AlertModal.vue";

const router = useRouter();

// 유저 정보
const account = useAccountStore();
const userInfo = useUserInfo()

const isMenuOpen = ref(false);

// 햄버거 버튼을 눌러 메뉴가 보이게 하거나 안 보이게 하는 함수
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
}

const alertModalRef = ref(null);

// 모달 표시하는 함수
const showModal = message => {
    alertModalRef.value.open(message);
};

// 로그아웃
const signOut = async () => {
    const res = await logout();
    account.setLoggedIn(false);
    router.push({ path: '/' });
};
</script>

<template>
    <b-container class="d-flex align-items-center justify-content-between h-100">
        <!-- (왼쪽) 로고 -->
        <div>
            <img class="logo-image" src="/src/imgs/hanipLogogroup.png" @click="router.push({ path: '/' })" />
        </div>

        <!-- (오른쪽) 햄버거 버튼 -->
        <div class="position-relative">
            <button class="hamburger btn m-2" type="button" @click="toggleMenu">
                ☰
            </button>

            <!-- 햄버거 버튼 누르면 나오는 메뉴 -->
            <b-collapse class="hamburger-menu position-absolute bg-white" :visible="isMenuOpen">
                <!-- 비로그인 시 메뉴 -->
                <template v-if="!account.state.loggedIn">
                    <button class="menu-button btn p-2 text-end" @click="showModal('로그인 후 이용 가능합니다.')">장바구니</button>
                    <button class="menu-button btn p-2 text-end" @click="router.push({ path: '/login' })">로그인</button>
                    <button class="menu-button btn p-2 text-end" @click="router.push({ path: '/join' })">회원가입</button>
                </template>
                
                <!-- 로그인 시 메뉴 -->
                <template v-else>
                    <button class="menu-button btn p-2 text-end" @click="router.push({ path: '/favorites' })">찜목록</button>
                    <button class="menu-button btn p-2 text-end" @click="router.push({ path: '/orders' })">주문내역</button>
                    <button class="menu-button btn p-2 text-end" @click="router.push({ path: '/cart' })">장바구니</button>
                    <button class="menu-button btn p-2 text-end" @click="signOut">로그아웃</button>
                    <button class="menu-button btn p-2 text-end" @click="router.push({ path: '/my-page' })">마이페이지</button>
                </template> 
            </b-collapse>
        </div>
    </b-container>

    <AlertModal ref="alertModalRef" />
</template>

<style lang="scss" scoped>
.logo-image {
    width: 190px;
    height: 38px;
    object-fit: contain;
    cursor: pointer;
}

.hamburger {
    border-color: #FF6666;
    color: #FF6666;

    &:hover {
        background-color: #FF6666;
        color: white;
    }
}

.hamburger-menu {
    top: 100%;
    right: 0;
    min-width: 150px;
}

.menu-button {
    width: 100%;
    border-radius: 0 !important;
    color: #FF6666;

    &:hover {
        background-color: #F2F2F2;
    }

    &:active {
        background-color: #F2F2F2;
        color: #FF6666;
    }
}
</style>