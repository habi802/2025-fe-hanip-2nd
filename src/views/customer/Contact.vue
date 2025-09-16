<script setup>
import ContactMain from "@/components/customerService/ContactMain.vue";
</script>

<template>
  <div class="contact">
    <div class="container">
      <div class="contact-header">
        <h2 class="title">FAQ</h2>
        <div class="titleLine"></div>
      </div>
      <ContactMain />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-size: 40px;
  font-weight: 600;
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
