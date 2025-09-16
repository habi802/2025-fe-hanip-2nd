<script setup>
defineProps({
  menu: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="d-flex justify-content-between align-items-center white-card">
    <div class="menu-card">
      <h6>{{ menu.name }}</h6>
      <p class="text-muted small">{{ menu.desc }}</p>
    </div>
    <div class="d-flex align-items-center">
      <span class="fw-bold">{{ menu.price.toLocaleString() }} 원</span>
      <img :src="menu.img" alt="menu" class="menu-img ms-3" />
    </div>
  </div>
</template>

<style scoped>
.menu-img {
  width: 70px;
  height: 70px;
  border-radius: 6px;
  object-fit: cover;
}
.menu-card {
    width: 693px;
    height: 130px;
}
</style>
