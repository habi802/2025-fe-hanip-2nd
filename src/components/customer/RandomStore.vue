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
const imgSrc = computed(() => {
    return props.store &&
        props.store.imagePath &&
        props.store.imagePath !== "null"
        ? `/pic/store-profile/${props.store.storeId}/${props.store.imagePath}`
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
                <h6 class="card-title">{{ props.store.name }}</h6>
                <div v-if="props.store.rating !== 'NaN'">
                    <img class="star" src="/src/imgs/star.png" />&nbsp;
                    <span class="small">
                        {{ props.store.rating }} ({{ leng }})&nbsp;&nbsp;
                        <img class="love" src="/src/imgs/love.png" />
                        &nbsp;{{ props.store.favorites }}
                    </span>
                </div>
                <div v-else>
                    <img class="star" src="/src/imgs/star.png" />
                    <span class="small">
                        0 ({{ leng }})&nbsp;
                        <img class="love" src="/src/imgs/love.png" />&nbsp;&nbsp;
                        {{ props.store.favorites }}
                    </span>
                </div>
                <p class="mb-1 text-muted">배달비 0원 ~ 3000원</p>
                <p class="mb-2 text-muted">최소 주문 금액 10,000원</p>
                <div class="d-flex justify-content-center align-items-center">
                    <button @click="sotreRouter" class="btn btn-outline-danger btn-sm">
                        자세히보기
                    </button>
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
    width: 310px;
}

#imgBigBox {
    border-radius: 15px !important;
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
</style>
