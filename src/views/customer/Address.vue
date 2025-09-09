<script setup>
import AddressBar from "@/components/address/AddressBar.vue";
import AddressCard from "@/components/address/AddressCard.vue";
</script>

<template>
  <div class="address">
    <div class="container">
      <h2 class="add-title">주소 설정</h2>
      <div class="titleLine"></div>
      <AddressBar />
      <AddressCard />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
}

.add-title {
  font-family: "BMJUA";
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  margin-top: 5rem;
  margin-bottom: 40px;
}
// 메인 구분 선
.titleLine {
  width: 100%;
  border-bottom: 3px solid #000;
  margin: 0 auto 3rem;
}
</style>
