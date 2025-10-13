<script setup>
import { ref, nextTick, watch, onUnmounted, onMounted } from 'vue';
import * as CropperModule from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const Cropper = CropperModule.default || CropperModule;

const props = defineProps({
  file: { type: Object, default: null },
  show: { type: Boolean, default: false }
});
const emit = defineEmits(['close', 'cropped']);

const BANNER_RATIO = 1900 / 400;   // 3:1
const OUTPUT_W = 1900;        // 가로
const OUTPUT_H = 400;         // 세로

let cropper = null;
const previewUrl = ref(null);
const imgRef = ref(null);

let _activeObjectUrl = null;

/** 내부 공용 정리 함수 */
function destroyCropper() {
  if (cropper && cropper.destroy) {
    cropper.destroy();
    cropper = null;
  }
}
function revokePreviewUrl() {
  if (_activeObjectUrl) {
    URL.revokeObjectURL(_activeObjectUrl);
    _activeObjectUrl = null;
  }
}

/** 파일이 바뀌면 새 프리뷰 만들고 크로퍼 초기화 */
watch(() => props.file, async (newFile) => {
  destroyCropper();
  revokePreviewUrl();

  if (!newFile) {
    previewUrl.value = null;
    return;
  }
  _activeObjectUrl = URL.createObjectURL(newFile);
  previewUrl.value = _activeObjectUrl;

  // 모달이 열려 있을 때만 크로퍼 생성
  await nextTick();
  if (props.show && imgRef.value) {
    cropper = new Cropper(imgRef.value, {
      aspectRatio: BANNER_RATIO,
      viewMode: 2,            // 크롭 영역이 캔버스 밖으로 못나가게(안정적)
      dragMode: 'move',       // 이미지만 드래그
      cropBoxResizable: false,
      cropBoxMovable: false,
      autoCropArea: 1,        // 크롭박스가 꽉 차도록
      background: false,
      responsive: true,
      ready() {
        // autoCropArea로 이미 꽉 채움. 별도 픽셀 강제 지정 불필요.
      }
    });
  }
}, { immediate: true });

/** 모달 show 상태가 바뀔 때 크로퍼 생성/파괴 */
watch(() => props.show, async (isOpen) => {
  if (!isOpen) {
    destroyCropper();
    return;
  }
  await nextTick();
  if (imgRef.value && previewUrl.value) {
    destroyCropper(); // 이중생성 방지
    cropper = new Cropper(imgRef.value, {
      aspectRatio: BANNER_RATIO,
      viewMode: 2,
      dragMode: 'move',
      cropBoxResizable: false,
      cropBoxMovable: false,
      autoCropArea: 1,
      background: false,
      responsive: true,
    });
  }
});

/** 키보드: ESC 닫기, Enter 적용 */
function onKey(e) {
  if (!props.show) return;
  if (e.key === 'Escape') emit('close');
  if (e.key === 'Enter' && previewUrl.value) applyCrop();
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
  destroyCropper();
  revokePreviewUrl();
});

/** 크롭 적용 */
const applyCrop = () => {
  if (cropper && typeof cropper.getCroppedCanvas === 'function') {
    const canvas = cropper.getCroppedCanvas({ width: OUTPUT_W, height: OUTPUT_H });
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
        emit("cropped", file);
        emit("close");
      }
    }, 'image/jpeg', 0.92);
  } else {
    console.error("Cropper.getCroppedCanvas 없음", cropper);
  }
};
</script>

<template>
  <!-- Bootstrap modal: Vue로 제어하므로 fade show d-block -->
  <div v-if="show">
    <div
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bannerModalTitle"
      @click.self="$emit('close')"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content shadow-lg rounded-3 overflow-hidden">
          <div class="modal-header">
            <h5 class="modal-title" id="bannerModalTitle">배너 이미지 조정</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
          </div>

          <div class="modal-body">
            <div v-if="previewUrl" class="text-center">
              <img
                ref="imgRef"
                :src="previewUrl"
                alt="배너 미리보기"
                class="img-fluid rounded"
                style="max-height: 60vh; object-fit: contain;"
              />
              <div class="form-text mt-2">
                출력 해상도: {{ OUTPUT_W }} × {{ OUTPUT_H }} ({{ Math.round(OUTPUT_W/OUTPUT_H*100)/100 }}:1)
              </div>
            </div>
            <div v-else class="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
              <div class="spinner-border mb-3" role="status" aria-hidden="true"></div>
              <p class="mb-0">이미지를 불러오는 중...</p>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary btn-eq" @click="$emit('close')">취소</button>
            <button type="button"  class="btn owner-btn-white btn-eq" :disabled="!previewUrl" @click="applyCrop">적용하기</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<style scoped>
/* Cropper 영역이 너무 커지지 않도록 안전장치 */
:deep(.cropper-container) {
  max-height: 60vh;
}

.btn-eq {
  padding: 0.5rem 1rem;        /* = Bootstrap .btn 기본 */
  font-size: 0.9375rem;        /* 15px 정도 */
  line-height: 1.5;
  border-radius: 0.375rem;     /* .btn 기본 라운드 */
  min-width: 110px;            /* 폭 통일용(선택) */
  box-sizing: border-box;
}
</style>
