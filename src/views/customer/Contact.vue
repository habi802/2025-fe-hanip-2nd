<script setup>
import HomeImg from "@/components/customer/HomeImg.vue";
import ContactMain from "@/components/customerService/ContactMain.vue";

const arrow = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<template>
  <HomeImg></HomeImg>
  <div class="contact">
    <div class="container">
      <div class="contact-header">
        <h2 class="title">FAQ</h2>
        <div class="titleLine"></div>
      </div>
      <ContactMain />
    </div>
  </div>
  <img @click="arrow" class="arrow" src="/src/imgs/arrow.png" />
</template>

<style lang="scss" scoped>
.contact {
  position: relative;
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

.title {
  font-size: 40px;
  font-weight: 400;
  text-align: center;
  margin-top: 80px;
}

// 메인 선
.titleLine {
  width: 1480px;
  border-bottom: 2px solid #000;
  margin-top: 80px;
  margin-bottom: 30px;
}
</style>
