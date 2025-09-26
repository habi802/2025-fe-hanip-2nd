<script setup>
import { naverGetCid, naverPayApply, naverPayReserve } from '@/services/payment';
import ReviewModal from '../modal/ReviewModal.vue';
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const baseUrl = import.meta.env.VITE_BASE_URL;

const reviewModal = ref(null);

const openModal = () => {
    const modalElement = reviewModal.value.$el;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
};

const naverPayBtn = ref(null);



const state = reactive({
    product: []
}
)

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

</script>

<template>
    <div class="btn" @click="openModal">asfasfasfafs </div>
    <ReviewModal ref="reviewModal"></ReviewModal>

    <button ref="naverPayBtn">네이버페이 결제 버튼</button>
    <button @click="btns">오더아이디 확인용</button>
</template>

<style scoped></style>