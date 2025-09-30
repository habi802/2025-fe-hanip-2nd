<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getReviewsByStoreId } from "@/services/reviewServices";

import defaultImage from "@/imgs/owner/haniplogo_sample2.png";

const router = useRouter();

const props = defineProps({
    store: Object,
    review: [],
});


// 가게 이미지
// const imgSrc = computed(() => {
//   return state.store.id && state.store.imagePath && state.store.imagePath !== 'null'
//     ? `${baseUrl.value}/images/store/${state.store.id}/${state.store.imagePath}`
//     : defaultImage;
// })

const baseUrl = ref(import.meta.env.VITE_BASE_URL);

// 가게 이미지
const imgSrc = computed(() => {
    return props.store &&
        props.store.imagePath &&
        props.store.imagePath !== "null"
        ? `${baseUrl.value}/images/store/${props.store.id}/${props.store.imagePath}`
        : defaultImage;
});

// 자세히보기 이동
const sotreRouter = () => {
    router.push(`/stores/${props.store.id}`);
};

onMounted(async () => {
    reviews();
    console.log("가게 정보", props.store)
});

// 별점 조회

let total = ref(0);
let leng = ref(0);

const reviews = async () => {
    const res = await getReviewsByStoreId(props.store.storeId);
    const length = res.data.resultData;
    leng = length.length;

    let totals = 0;
    for (let i = 0; i < length?.length; i++) {
        const forNum = length[i]?.rating;
        totals += forNum;
    }
    totals = (totals / length?.length).toFixed(1);
    total.value = totals;
    // console.log("total", totals);
};
</script>

<template>
    <div class="all">
        <div id="imgBigBox" class="card h-100 shadow-sm">
            <div id="imgBox" class="card-img-top">
                <img class="sImg" :src="imgSrc" @error="(e) => (e.target.src = defaultImage)" />
            </div>
            <!-- <img src="" class="card-img-top" alt="음식 이미지"> -->
            <div class="card-body">
                <div class="card-top">
                    <div class="card-title">{{ props.store.name }}</div>
                    <div>
                        <img class="star" src="/src/imgs/star.png" />&nbsp;
                        <span class="small">
                            {{ props.store.rating }} ({{ leng }})&nbsp;&nbsp;
                            <img class="love" src="/src/imgs/love.png" />
                            &nbsp;{{ props.store.favorites }}
                        </span>
                    </div>
                </div>
                <div class="cart-bottom">
                    <div>
                        <div class="card-text">배달비 0원 ~ 3000원</div>
                        <div class="card-text">최소 주문 금액 10,000원</div>
                    </div>
                    <div class="d-flex justify-content-center align-items-center">
                        <button @click="sotreRouter" class="btn btn-outline-danger btn-sm">
                            자세히보기
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<style>
#imgBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 251px;
    overflow: hidden;
}

.sImg {
    height: 100%;
    border-radius: 15px;
}

#imgBigBox {
    border-radius: 15px;
    overflow: hidden;
}

.imgBox {
    width: 100%;
}

.btn {
    width: 150px;
    background-color: #ff6666;
    color: #fff;
    border-radius: 6px;
}

.star {
    width: 20px;
}

.love {
    width: 20px;
}

.card-top {
    display: flex;
    justify-content: space-between;
}

.cart-bottom {
    display: flex;
    justify-content: space-between;
}

.card-text {
    color: #797979;
    font-weight: 400;
    font-size: 0.8em;
}

.btn {
    width: 100px;
}
</style>
