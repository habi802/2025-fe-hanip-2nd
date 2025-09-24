<script setup>
import { ref, computed } from 'vue';
import defaultImage from "@/imgs/owner/haniplogo_sample.png";

const props = defineProps({
  menu: { type: Object, required: true },
});

const previewImage = ref(defaultImage);
const baseUrl = ref(import.meta.env.VITE_BASE_URL);

const imgSrc = computed(() => {
  if (previewImage.value && previewImage.value !== defaultImage) {
    return previewImage.value;
  }
  if (props.menu?.imagePath && props.menu.imagePath !== "null") {
    return `${baseUrl.value}/images/store/${props.menu.storeId}/menu/${props.menu.menuId}/${props.menu.imagePath}`;
  }
  return defaultImage;
});

const emit = defineEmits(["select"]);
console.log("props.men: ", props.menu.menuId)
</script>

<template>
 <div
  class="menu-card d-flex justify-content-between align-items-center"
  :class="{ dimmed: !menu.isHide }"
  @click="emit('select', menu.menuId)"
>
  <!-- 상태 배지 -->
  <div v-if="!menu.isHide || !menu.isSoldOut" class="status-overlay">
    <p v-if="!menu.isHide" class="hidden-text">숨겨진 메뉴</p>
    <p v-if="!menu.isSoldOut" class="soldout-text">품절됨</p>
  </div>

  <!-- 메뉴 정보 -->
  <div class="menu-info">
    <h6 class="fw-bold mb-1 text-truncate">{{ menu.name }}</h6>
    <p class="text-muted small text-truncate">{{ menu.comment }}</p>
  </div>

  <!-- 가격 + 이미지 -->
  <div class="d-flex align-items-center">
    <span class="fw-bold">
      {{ Number(menu.price ?? 0).toLocaleString() }} 원
    </span>
    <img
      :src="imgSrc"
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
  position: relative;
  overflow: hidden;
}

/* 숨김일 때만 카드 흐리게 */
.menu-card.dimmed {
  opacity: 0.5;
}

.status-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;
}

.hidden-text {
  margin: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
}

.soldout-text {
  margin: 0;
  background: #ff4d4f;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
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

.menu-card:hover * {
  color: #fff !important;
}
</style>
