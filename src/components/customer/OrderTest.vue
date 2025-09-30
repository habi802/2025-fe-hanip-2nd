<script setup>
import { naverGetCid, naverPayApply, naverPayReserve } from '@/services/payment';
import ReviewModal from '../modal/ReviewModal.vue';
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OrderAndReview from '../myPage/OrderAndReview.vue';
import { getOrder } from '@/services/orderService';

const route = useRoute();
const router = useRouter();

const baseUrl = import.meta.env.VITE_BASE_URL;

const reviewModal = ref(null);

const openModal = (id) => {
    const modalElement = reviewModal.value.$el;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
};

const naverPayBtn = ref(null);






// const btns = async () => {
//     const orderI = 7;
//     console.log("orderI", orderI)
//     console.log("왜이러지요")
//     const res = await naverPayReserve(orderI);
//     console.log("res", res)
// }




// onMounted(() => {


//     const paymentId = route.query.paymentId;
//     const orderId = route.query.orderId;
//     const paymentReq = {
//         paymentId: route.query.paymentId
//     }

//     if (paymentId != null) {
//         console.log("payId:", paymentId);
//         const apply = async () => {
//             const check = await naverPayApply(paymentId, orderId);
//             console.log("체크 확인", check);
//             const finalPaymentId = check.data.resultData.body.paymentId;

//             if (check.data || check.data.resultStatus === 200) {
//                 console.log("라우터 확인용", "잘 이동합니다")
//                 console.log("쿼리 넘어오는 거 머있니", orderId, finalPaymentId)
//                 router.push({ path: '/', query: { orderId, paymentId: finalPaymentId } })
//                     .then(() => console.log("라우터 이동 성공!"))
//                     .catch(error => console.error("라우터 이동 실패:", error));

//             }

//         }


//         apply();
//     }


// });

const state = reactive({
    orders: [],
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
        @review="openModal(order.orderId)" />
</template>

<style scoped></style>