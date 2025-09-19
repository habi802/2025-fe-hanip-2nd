<script setup>
import { naverPayReserve } from '@/services/payment';
import ReviewModal from '../modal/ReviewModal.vue';
import { ref, onMounted, reactive } from 'vue';

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

const btns = async () => {
    const orderI = 6;
    console.log("6", orderI)
    console.log("왜이러지요")
    const res = await naverPayReserve(orderI);
    console.log("res", res)
}




onMounted(() => {
    // 네이버페이 SDK 로드
    const script = document.createElement('script');
    script.src = 'https://nsp.pay.naver.com/sdk/js/naverpay.min.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
        // SDK 로드 후 Naver.Pay 객체 생성
        const oPay = window.Naver.Pay.create({
            mode: 'development', // 개발용: development / 실제: production
            clientId: 'HN3GGCMDdTgGUfl0kFCo',
            chainId: 'NFlxNnUza3lTNzV'
        });

        // 네이버페이 결제 버튼 클릭 이벤트
        naverPayBtn.value.addEventListener('click', async () => {
            try {

                console.log("버튼 클릭 확인")
                const orderId = 7;
                const res = await naverPayReserve(orderId);
                console.log("res", res)

                const item = res.data.resultData;
                console.log("item", item)


                // 네이버페이 화면 열기
                oPay.open({
                    merchantPayKey: item.merchantPayKey,
                    productName: item.productName,
                    productCount: item.productCount,
                    totalPayAmount: item.totalPayAmount,
                    taxScopeAmount: item.taxScopeAmount,
                    taxExScopeAmount: item.taxExScopeAmount,
                    returnUrl: item.returnUrl,
                    productItems: item.productItems
                });
            } catch (err) {
                console.error("네이버페이 reserve 호출 오류:", err);
            }
        });
    };
});

</script>

<template>
    <div class="btn" @click="openModal">asfasfasfafs </div>
    <ReviewModal ref="reviewModal"></ReviewModal>

    <button ref="naverPayBtn">네이버페이 결제 버튼</button>
    <button @click="btns">오더아이디 확인용</button>
</template>

<style scoped></style>