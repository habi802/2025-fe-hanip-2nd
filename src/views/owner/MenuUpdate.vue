<script setup>
import { ref } from "vue";

// 메뉴 정보
const menuForm = ref({
  name: "",
  description: "",
  price: "",
  image: null,
  imagePreview: "",
});

// 파일 선택 시 미리보기
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    menuForm.value.image = file;
    menuForm.value.imagePreview = URL.createObjectURL(file);
  }
};

// 이벤트 핸들러
const cancelEdit = () => {
  // 이전 화면으로 가기 등 구현
  alert("수정 취소");
};

const submitEdit = () => {
  // API 호출 및 FormData 처리 구현
  alert("수정 완료");
};
</script>

<template>
  <div class="min-vh-100 py-5">
    <div class="container d-flex justify-content-center">
      <div class="card shadow p-5 w-100" style="max-width: 1100px">
        <div class="flex gap-12">
          <!-- 왼쪽: 메뉴 이미지 -->
          <div class="flex flex-col items-center">
            <div
              class="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-4"
            >
              <img
                v-if="menuForm.imagePreview"
                :src="menuForm.imagePreview"
                alt="미리보기"
                class="object-cover w-full h-full"
              />
              <span v-else class="text-gray-500">메뉴 사진</span>
            </div>
            <input type="file" @change="handleFileChange" class="text-sm" />
          </div>

          <!-- 오른쪽: 메뉴 정보 -->
          <div class="flex-1 space-y-6">
            <div>
              <label class="block mb-1 font-semibold">메뉴 이름</label>
              <input
                v-model="menuForm.name"
                type="text"
                class="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label class="block mb-1 font-semibold">메뉴 상세설명</label>
              <textarea
                v-model="menuForm.description"
                class="w-full border rounded-lg p-2 h-32"
              ></textarea>
            </div>

            <div>
              <label class="block mb-1 font-semibold">가격</label>
              <input
                v-model="menuForm.price"
                type="number"
                class="w-full border rounded-lg p-2"
              />
            </div>

            <!-- 버튼 영역 -->
            <div class="flex gap-4 mt-8">
              <button
                @click="cancelEdit"
                class="bg-red-400 text-white px-6 py-2 rounded-lg"
              >
                수정 취소
              </button>
              <button
                @click="submitEdit"
                class="bg-gray-400 text-white px-6 py-2 rounded-lg"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
