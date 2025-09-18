<script setup>
defineProps({
  menu: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="menu-card d-flex justify-content-between align-items-center">
    <!-- 왼쪽: 메뉴 정보 -->
    <div class="menu-info">
      <h6 class="fw-bold mb-1 text-truncate">{{ menu.name }}</h6>
      <p class="text-muted small text-truncate">{{ menu.desc }}</p>
    </div>

    <!-- 오른쪽: 가격 + 이미지 -->
    <div class="d-flex align-items-center">
      <span class="fw-bold">{{ menu.price.toLocaleString() }} 원</span>
      <img :src="menu.img" alt="menu" class="menu-img ms-3" />
    </div>
  </div>
</template>

<style scoped>
.menu-card {
  width: 693px; 
  height: 130px; 
  padding: 15px;
  margin-bottom: 12px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-card:hover * {
  color: #fff !important;
}

.menu-img {
  width: 90px;
  height: 90px;
  border-radius: 6px;
  object-fit: cover;
}

.menu-info {
  flex: 1;
  overflow: hidden;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
