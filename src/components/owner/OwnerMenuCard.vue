<script setup>
import { defineProps, ref } from 'vue'
import defaultMenuImage from "@/imgs/owner/haniplogo_sample.png"

// ref
const previewImage = ref(defaultMenuImage);

const props = defineProps({
  menu: {
    id: "",
    type: Object,
    required: true
  }
})

// 사진 미리보기
previewImage.value = defaultMenuImage;

const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    menu.imagePath = file;
  }
};
</script>

<template>
<div class="card mb-3 shadow-sm w-100" style="max-width: 590px; height: 250px;">
    <div class="row g-0 h-100">
        <div class="col-md-5 d-flex align-items-center justify-content-center">
            <img 
            :src="previewImage"
            alt="메뉴 사진 미리보기"
            style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 12px;"/>
        </div>
        <div class="col-md-7 d-flex flex-column justify-content-between p-3">
            <div>
                <h5 class="card-title">{{ menu.name }}</h5>
                <h6 class="text-muted">{{ menu.price.toLocaleString() + '원' }}</h6>
                <p class="card-text small mt-2">{{ menu.comment }}</p>
            </div>
            <button @click="editMenu" class="btn btn-danger align-self-end mt-3">수정 버튼</button>
        </div>
    </div>
</div>
</template>
  
