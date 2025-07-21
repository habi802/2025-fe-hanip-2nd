<script setup>
import Category from '@/components/Category.vue';
import HomeImg from '@/components/HomeImg.vue';
import Guide from '@/components/Guide.vue';
import { onMounted } from 'vue';

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

const arrow = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const handleScroll = () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  console.log(scrollY);
  console.log('w :', windowHeight);

  if (scrollY < 2037) {
  }
};
</script>

<template>
  <div class="allBody">
    <HomeImg></HomeImg>
    <category></category>
    <Guide></Guide>
    <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />
  </div>
</template>

<style lang="scss" scoped>
.allBody {
  position: relative;
  height: 100%;
}
.arrow {
  position: fixed;
  width: 72px;
  bottom: 100px;
  left: 1800px;
  z-index: 999;
}
</style>
