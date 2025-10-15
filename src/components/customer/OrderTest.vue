<script setup>
import { naverGetCid, naverPayApply, naverPayReserve } from '@/services/payment';
import ReviewModal from '@/components/modal/ReviewModal.vue';
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OrderAndReview from '@/components/customer/OrderCard.vue';
import { getOrder } from '@/services/orderService';

const route = useRoute();
const router = useRouter();

const baseUrl = import.meta.env.VITE_BASE_URL;

const reviewModal = ref(null);

const openModal = (orderId, storeName, menuItems, getReview) => {


    state.orderOne.orderId = orderId;
    state.orderOne.storeName = storeName;
    state.orderOne.menuItems = menuItems
    state.orderOne.getReview = getReview;

    reviewModal.value.setMenuData(state.orderOne)
    const modalElement = reviewModal.value.$el;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    setTimeout(() => {
        if (reviewModal.value.swiperInstance) {
            reviewModal.value.swiperInstance.update(); // 기존 Swiper 업데이트
        }
    }, 50);
};

const state = reactive({
    orders: [],
    orderOne: {
        orderId: 0,
        storeName: "",
        getReview: 0,
        menuItems: []
    }
});

onMounted(async () => {
    const res = await getOrder({ page: 1, rowPerPage: 10 });
    if (res !== undefined && res.status === 200) {
        state.orders = res.data.resultData;
        console.log("오더 정보", state.orders)
    }
    console.log("오더 정보", res)
});
const reOrder = async menus => {
    let confirmCartRemove = false;

    const cartRes = await getItem();
    if (cartRes !== undefined && cartRes.status === 200) {
        const carts = cartRes.data.resultData;
        if (carts !== null && carts.length > 0) {
            const isConfirmed = await confirmModalRef.value.showModal('이미 장바구니에 메뉴가 담겨져 있습니다. 장바구니를 비우고 선택한 메뉴를 장바구니에 담으시겠습니까?');
            if (isConfirmed) {
                confirmCartRemove = true;
            }
        } else {
            confirmCartRemove = true;
        }

        if (confirmCartRemove) {
            const cartRemoveRes = await removeCart();
            if (cartRemoveRes !== undefined && cartRemoveRes.status === 200) {
                // 선택한 주문 내역의 메뉴가 장바구니에 다 담긴 후에 장바구니로 이동
                const promises = menus.map(menu => {
                    const optionId = [];

                    menu.options.forEach(option => {
                        optionId.push(option.optionId);
                        optionId.push(option.children[0].optionId);
                    });

                    const params = {
                        menuId: menu.menuId,
                        optionId,
                        quantity: menu.quantity,
                    };

                    return addItem(params);
                });

                await Promise.all(promises);

                router.push({ path: '/cart' });
            }
        }
    }
};


</script>

<template>
    <div class="btn" @click="openModal">asfasfasfafs </div>
    <ReviewModal ref="reviewModal"></ReviewModal>

    <button ref="naverPayBtn">네이버페이 결제 버튼</button>
    <button @click="btns">오더아이디 확인용</button>

    <order-and-review v-for="order in state.orders" :key="order.orderId" :order="order" @delete-order="removeOrder"
        @review="openModal(order.orderId, order.storeName, order.menuItems, order.getReview)" />
</template>

<style lang="scss" scoped></style>