<script setup>
import '@/assets/customer/customer.css'

import { onMounted, nextTick } from 'vue';
import Category from '@/components/customer/Category.vue';
import HomeImg from '@/components/customer/HomeImg.vue';
import Guide from '@/components/customer/Guide.vue';
import RecommendStore from '@/components/customer/RecommendStore.vue';
import { useRoute } from 'vue-router';
import { naverGetCid } from '@/services/payment';


const route = useRoute();

onMounted(() => {
    // 라우터가 처음 로드됐을 때
    // naverPay();

    // // 쿼리가 나중에 들어오는 경우 대비
    // watch(
    //     () => route.query,
    //     (newQuery) => {
    //         if (newQuery.routeOrderId && newQuery.paymentId) {
    //             console.log("쿼리 감지용", newQuery);
    //             naverPay();
    //         }
    //     },
    //     { immediate: true } // 처음에도 바로 실행
    // );
});

// const naverPay = async () => {
//     if (route.query.routeOrderId && route.query.paymentId) {
//         console.log("쿼리 들어옴", route.query);

//         const orderId = parseInt(route.query.routeOrderId);
//         const paymentId = route.query.paymentId;


//         if (orderId || paymentId) {

//             const payreq = {
//                 paymentId: route.query.paymentId
//             }

//             console.log("orderId", orderId);
//             console.log("paymentId", paymentId);

//             const tid = await naverGetCid(orderId, payreq);
//             console.log("cid 주입 완료", tid);
//             window.location.href = window.location.pathname;
//         }


//     } else {
//         console.log("쿼리 안 옴");
//     }

// }




const arrow = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

// const handleScroll = () => {
//     const scrollY = window.scrollY;
//     const windowHeight = window.innerHeight;
//     console.log(scrollY);
//     console.log('w :', windowHeight);
// };
</script>

<template>
    <div class="allBody">
        <HomeImg></HomeImg>
        <category></category>
        <Guide></Guide>
        <RecommendStore></RecommendStore>
        <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />
    </div>
</template>

<style lang="scss" scoped>
.allBody {
    position: relative;
    height: 100%;
}

.arrow {
    position: sticky;
    width: 2.8%;
    bottom: 100px;
    left: 93%;
    z-index: 999;
    margin-bottom: 100px;

    &:hover {
        opacity: 80%;
    }
}

// 반응형
@media (max-width:800px) {
    .arrow {
        position: relative;
        width: 40px;
        bottom: 250px;
        left: 46.5%;
    }
}
</style>
