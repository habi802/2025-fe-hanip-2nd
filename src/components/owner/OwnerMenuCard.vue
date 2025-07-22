<script setup>
defineProps({
  image: String,
  name: String,
  price: 12,
  description: String,
});
</script>

<template>
    <div class="flex items-center bg-white rounded-xl shadow-md p-6 w-full">
      <!-- 이미지 -->
      <img :src="image" alt="메뉴 이미지" class="w-48 h-36 rounded-lg object-cover mr-6" />
  
      <!-- 텍스트 -->
      <div class="flex-1">
        <h3 class="text-xl font-bold mb-2">{{ name }}</h3>
        <p class="text-lg text-gray-700 font-semibold mb-2">{{ }}원</p>
        <p class="text-sm text-gray-600">{{ description }}</p>
      </div>
  
      <!-- 수정 버튼 -->
      <button
        class="ml-6 bg-red-400 text-white px-6 py-2 rounded-xl hover:bg-red-500 transition"
        @click="$emit('edit')"
      >
        수정 버튼
      </button>
    </div>
  </template>
  
