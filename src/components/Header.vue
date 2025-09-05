<script setup>
import { useRouter } from "vue-router";
import { useUserInfo, useAccountStore } from "@/stores/account";
import { getUser, logout } from "@/services/userService";
import { reactive, ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from 'pinia';
import Menu from "@/components/Menu.vue";
import { getOrder } from "@/services/storeService";
import AlertModal from "./modal/AlertModal.vue";

const account = useAccountStore();
// 유저 정보
const userInfo = useUserInfo()
const router = useRouter();
const homeRouter = () => {
    router.push("/");
};

const state = reactive({
    user: Object
});

// 주문하기로 이동하는 함수
const toOrder = () => {
    if (!account.state.loggedIn) {
        alert("로그인 후 주문이 가능합니다.");
        return;
    } else if (state.carts.length < 1) {
        alert("메뉴를 선택해주세요.");
        return;
    }

    carts.state.items = state.carts;
    router.push({ path: `/stores/${route.params.id}/order` });
};

// 로그아웃
const logoutIn = async () => {
    const res = await logout();
    account.setLoggedIn(false);
    location.href = "/";
};

// 마이 페이지 이동
const myPageRouter = () => {
    router.push("/my-page");
};

// 카트 페이지로 이동
const cartRouter = () => {
    if (!account.state.loggedIn) {
        showModal('로그인 후 이용 가능합니다.');
        return;
    }
    router.push("/cart");
};

// 찜 목록 이동
const faivorite = () => {
    router.push("/favorites");
};

// 주문내역 페이지로 이동
const orderRouter = () => {
    router.push("/orders");
};

// 주문 내역 페이지 on off
let orderBox = ref(false);

const totalPrice = ref(0);

const alertModalRef = ref(null);

// 모달 표시하는 함수
const showModal = message => {
    alertModalRef.value.open(message);
};

// 유저 정보에 따른 주소표시
// const userAddr = computed(() => {
//      return (userInfo.userAddr ?? '') + (userInfo.userAddrDetail ?? '');
// });
//const userAddr = computed(() => userInfo.userAddr ?? '주소 없음');
const { userAddr } = storeToRefs(userInfo);

// 유저 정보 불러오기 비동기실행
onMounted(async () => {
    //console.log("🟡 onMounted 진입");

    if (account.state.loggedIn) {
        //console.log("🟢 로그인 상태, fetchStore 실행");
        userInfo.fetchStore();
    }
});

// 로그인 상태가 바뀌면 자동으로 fetchStore 실행
watch(
    () => account.state.loggedIn,
    (val) => {
        if (val) {
            //console.log("👀 로그인 감지됨 → fetchStore 실행");
            userInfo.fetchStore();
        }
    }
);

//userAddr.value = userInfo.userAddr ?? '';
//피니아에서 실행되기때문에 아래 두 코드는필요없지만 일반 보류!
//const res = await getUser();
//console.log("유저 정보", res?.data?.resultData);
</script>

<template>
    <div class="navbar">
        <div class="naverBox">
            <div class="logoBox">
                <img @click="homeRouter" class="logo" src="/src/imgs/hanipLogogroup.png" />
            </div>

            <!-- 로그인된 경우 -->
            <template v-if="account.state.loggedIn">
            <div class="searchBar">
                <img @click="caLink" class="searchImg" src="/src/imgs/weui_location-filled.png" />
                <div class="addressText2">{{ userAddr || '주소 없음' }}</div>
            </div>
            </template>

            <!-- 비로그인 -->
            <template v-else>
                <div class="searchBar">
                    <img @click="caLink" class="searchImg" src="/src/imgs/weui_location-filled.png" />
                    <div class="addressText">주소를 입력해주세요</div>
                </div>
            </template>
            <div class="containerOne">
                <div class="menus d-flex gap-3">
                    <template v-if="account.state.loggedIn">
                        <img @click="faivorite" class="faiorites" src="/src/imgs/faivor.png" />
                        <img @click="orderRouter" class="order" src="/src/imgs/orders.png" />
                        <img @click="cartRouter" id="menu"
                            class="shooping" src="/src/imgs/shoop.png" />
                        <div id="menu" @click="logoutIn">로그아웃</div>
                        <div>|</div>
                        <div class="myPage" @click="myPageRouter">마이페이지</div>
                    </template>

                    <template v-else>
                        <img @click="cartRouter" id="menu" class="shooping" src="/src/imgs/shoop.png" />
                        <div class="login">
                            <router-link id="menu" to="/login">로그인</router-link>
                        </div>
                        <a id="menu">|</a>
                        <router-link id="menu" to="/join">회원가입</router-link>
                    </template>
                </div>
            </div>
        </div>

        <!-- 주문표 부분 -->
        <div v-if="orderBox" class="col-12 col-md-4 d-flex flex-column p-3">
            <div class="row border rounded p-4 mb-2">
                <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                    <span>주문표</span>
                </div>
                <div v-if="state.carts !== undefined && state.carts.length > 0">
                    <div v-for="(item, idx) in state.carts" :key="item.id">
                        <div class="p-2" :class="{ 'border-top': idx !== 0 }">
                            <div class="d-flex justify-content-between mb-2">
                                <span>{{ item.name }}</span>
                                <span>{{ (item.price * item.quantity).toLocaleString() }}원</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <button type="button" class="btn btn-basic btn-quantity" @click="decreaseQuantity(idx)">
                                    -
                                    </button>
                                    <span class="p-3">{{ item.quantity }}</span>
                                    <button type="button" class="btn btn-basic btn-quantity" @click="increaseQuantity(idx)">
                                    +
                                    </button>
                                </div>
                                <div>
                                    <button type="button" class="btn btn-basic btn-submit" @click="deleteCart(item.id)">
                                    메뉴 취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>담긴 메뉴가 없습니다</div>
                <div class="text-end border-top pt-2 mt-2">
                    {{ totalPrice.toLocaleString() }}원
                </div>
            </div>
        </div>
    </div>

    <AlertModal ref="alertModalRef" />
</template>

<style lang="scss" scoped>
@font-face {
    // 프리텐다드
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

.navbar {
    height: 90px;
    background-color: #fff;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    -webkit-box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
    box-shadow: 1px 9px 13px -1px rgba(0, 0, 0, 0.12);
    //
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
}

.naverBox {
    width: 1500px;
    display: flex;
    justify-content: space-between;
}

.containerOne {
    width: 400px;
    margin-bottom: 30px;
    margin-top: -5px;

    .shooping {
        width: 45px;
        margin-right: 14px;
    }

    .order {
        width: 45px;

        cursor: pointer;
    }

    .myPage {
        margin-right: 14px;
        cursor: pointer;
    }

    .faiorites {
        width: 34px;
        margin-right: 2px;
    }
}

.logoBox {
    display: flex;
    align-items: center;
    width: 400px;
}

.logo {
    width: 190px;
    height: auto;
    object-fit: contain;
    cursor: pointer;
}

.menus {
    justify-content: end;
    color: #ff6666;
    font-weight: 800;
    font-size: 13px;
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-top: 30px;
}

.searchBar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;

    .searchImg {
        width: 20px;
    }
}

.addressText {
    margin-left: 15px;
    color: #fdbdbd;
    font-weight: 800;
}

.addressText2 {
    margin-left: 15px;
    color: #fdbdbd;
}

.col-12 {
    background-color: #fff;
    margin-left: auto;
    margin-top: -10px;
}

.faiorites {
    cursor: pointer;
}

#menu {
    cursor: pointer;
    text-decoration: none;
    font-weight: 800;
    color: #ff6666;
}

.modal {
    font-family: 'Pretendard-Regular';
    font-weight: 800;
}

@media (max-width: 1650px) {
    .searchBar {
        display: none;
    }
}

@media (max-width: 1200px) {
    .containerOne {
        display: none;
    }

    .navbar {
        display: flex;
        justify-content: center;
        position: fixed;
        margin-left: 0px;

        img.logo {
            margin-left: 0px;
        }
    }
}
</style>
