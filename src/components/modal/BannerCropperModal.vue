<script setup>
import { ref, nextTick, watch, onUnmounted } from 'vue';
import Cropper from 'cropperjs';

const props = defineProps({
  file: { type: Object, default: null },
  show: { type: Boolean, default: false }
});
const emit = defineEmits(['close', 'cropped']);

let cropper = null;
const previewUrl = ref(null);

watch(() => props.file, async (newFile) => {
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile);
    await nextTick();
    const img = document.getElementById("banner-crop-img");
    if (cropper) cropper.destroy();
    cropper = new Cropper(img, {
      aspectRatio: 3 / 1,
      viewMode: 1,
      movable: true,
      zoomable: true,
      cropBoxResizable: true
    });
  }
});

onUnmounted(() => { if (cropper) cropper.destroy(); });

const applyCrop = () => {
  if (cropper) {
    cropper.getCroppedCanvas({ width: 600, height: 200 }).toBlob((blob) => {
      const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
      emit("cropped", file);
      emit("close");
    });
  }
};
</script>

<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal">
      <h3>배너 이미지 조정</h3>
      <img v-if="previewUrl" id="banner-crop-img" :src="previewUrl" />
      <p v-else>이미지를 불러오는 중...</p>
      <div class="actions">
        <button @click="$emit('close')">취소</button>
        <button @click="applyCrop">적용하기</button>
      </div>
    </div>
  </div>
</template>

<style>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999; /* 🔥 배경도 맨 위 */
}
.modal {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 700px;
  width: 90%;
  z-index: 10000;
}
.actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
#banner-crop-img {
  max-width: 100%;
  max-height: 400px;
  display: block;
  margin: 0 auto;
}
</style>
