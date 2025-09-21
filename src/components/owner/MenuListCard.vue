<script setup>
const props = defineProps({
  menu: { type: Object, required: true },
});
const emit = defineEmits(["select"]);
</script>

<template>
  <div
    class="menu-card d-flex justify-content-between align-items-center"
    @click="emit('select', menu.menuId)"
  >
    <div class="menu-info">
      <h6 class="fw-bold mb-1 text-truncate">{{ menu.name }}</h6>
      <p class="text-muted small text-truncate">{{ menu.comment }}</p>
    </div>

    <div class="d-flex align-items-center">
      <span class="fw-bold"
        >{{ Number(menu.price ?? 0).toLocaleString() }} 원</span
      >
      <img
        :src="menu.imagePath || '/img/placeholder-menu.png'"
        alt="menu"
        class="menu-img ms-3"
      />
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
