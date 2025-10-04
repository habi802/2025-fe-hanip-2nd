<script setup>
import { ref, nextTick, watch, onUnmounted } from 'vue';
import * as CropperModule from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const Cropper = CropperModule.default || CropperModule;

const props = defineProps({
  file: { type: Object, default: null },
  show: { type: Boolean, default: false }
});
const emit = defineEmits(['close', 'cropped']);

let cropper = null;
const previewUrl = ref(null);
const imgRef = ref(null);

watch(() => props.file, async (newFile) => {
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile);
    await nextTick();
    if (imgRef.value) {
      if (cropper && cropper.destroy) cropper.destroy();
      cropper = new Cropper(imgRef.value, {
  aspectRatio: 1900 / 400,   // 🔥 3:1과 거의 동일
  viewMode: 1,
  dragMode: 'move',          // 🔥 마우스로 이미지만 움직일 수 있음
  cropBoxResizable: false,   // 박스 크기 조절 불가
  cropBoxMovable: false,     // 박스 위치 이동 불가
  autoCropArea: 1,           // 박스가 캔버스를 꽉 채우게
  ready() {
    // 🔥 크롭박스 강제 사이즈 세팅
    const cropBoxData = cropper.getCropBoxData();
    cropper.setCropBoxData({
      left: cropBoxData.left,
      top: cropBoxData.top,
      width: 1900,
      height: 400
    });
  }
});
    }
  }
});

onUnmounted(() => { if (cropper && cropper.destroy) cropper.destroy(); });

const applyCrop = () => {
  if (cropper && typeof cropper.getCroppedCanvas === 'function') {
    const canvas = cropper.getCroppedCanvas({ width: 600, height: 200 });
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
        emit("cropped", file);
        emit("close");
      }
    });
  } else {
    console.error("Cropper.getCroppedCanvas 없음", cropper);
  }
};
</script>


<template>
  <div v-if="show" class="modal-backdrop">
    <div class="custom-modal">
      <h3>배너 이미지 조정</h3>
      <img v-if="previewUrl" ref="imgRef" :src="previewUrl" />
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
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex; /* 🔥 중요: 가운데 정렬 */
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.custom-modal {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 700px;
  width: 90%;
  text-align: center;
}

.custom-modal img {
  max-width: 100%;
  max-height: 400px; /* 🔥 미리보기 높이 제한 */
  object-fit: contain; /* 이미지 비율 유지 */
}

#banner-crop-img {
  max-width: 100%;
  max-height: 700px;
  display: block;
  margin: 0 auto;
}
</style>
