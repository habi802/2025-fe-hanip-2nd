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
</script>

<template>
  <div
   class="menu-card d-flex justify-content-between align-items-center"
   :class="{ dimmed: !menu.isHide }"
   @click="emit('select', menu.menuId)"
 >
   <!-- 좌측: 제목 + 배지 + 코멘트 -->
   <div class="menu-info">
     <div class="title-row">
       <h6 class="fw-bold mb-1 title-text">{{ menu.name }}</h6>
       <div class="chips">
         <!-- 기존 조건 그대로 사용 -->
         <span v-if="!menu.isHide" class="chip chip-hidden">숨김</span>
         <span v-if="!menu.isSoldOut" class="chip chip-soldout">품절</span>
       </div>
     </div>
     <p class="text-muted small text-truncate mb-0">{{ menu.comment }}</p>
   </div>
 
   <!-- 우측: 가격 + 이미지 -->
   <div class="d-flex align-items-center">
     <span class="fw-bold">
       {{ Number(menu.price ?? 0).toLocaleString() }} 원
     </span>
     <img :src="imgSrc" alt="menu" class="menu-img ms-3" />
   </div>
 </div>
 </template> 

<style scoped>
.title-row { display:flex; align-items:center; gap:8px; }
.title-text {
  margin:0;
  max-width: 360px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.chips { display:flex; align-items:center; gap:6px; flex-shrink:0; }
.chip {
  display:inline-flex; align-items:center;
  padding:2px 8px; font-size:12px; font-weight:700;
  border-radius:999px; line-height:1.2; user-select:none;
}
.chip-hidden { background:rgba(0,0,0,0.6); color:#fff; }
.chip-soldout { background:#ff4d4f; color:#fff; }

.menu-card { width:693px; height:130px; padding:15px; margin-bottom:12px; border:1px solid #eee; border-radius:10px; background:#fff; display:flex; justify-content:space-between; align-items:center; position:relative; overflow:hidden; }
/* .menu-card.dimmed { opacity:0.5; } */
.menu-img { width:90px; height:90px; border-radius:6px; object-fit:cover; }
.menu-info { flex:1; overflow:hidden; min-width:0; }
.text-truncate { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.menu-card:hover * { color:#fff !important; }
</style>
