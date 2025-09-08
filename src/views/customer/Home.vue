<script setup>
import '@/assets/customer/customer.css'

import { onMounted } from 'vue';
import Category from '@/components/customer/Category.vue';
import HomeImg from '@/components/customer/HomeImg.vue';
import Guide from '@/components/customer/Guide.vue';
import RecommendStore from '@/components/customer/RecommendStore.vue';

// onMounted(() => {
//     window.addEventListener('scroll', handleScroll);
// });

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
    width: 3.8%;
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
