<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">마이페이지</h1>

    <!-- 프로필 -->
    <div class="bg-white p-4 rounded-xl shadow mb-6 flex items-center gap-4">
      <img src="/imgs/profile.png" alt="프로필" class="w-16 h-16 rounded-full border" />
      <div>
        <p class="text-lg font-semibold">{{ user.name }} 님</p>
        <p class="text-gray-500 text-sm">{{ user.email }}</p>
      </div>
      <button @click="editProfile" class="ml-auto bg-blue-500 text-white px-4 py-2 rounded-xl">
        프로필 수정
      </button>
    </div>

    <!-- 탭 메뉴 -->
    <div class="flex gap-4 border-b mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-4 py-2 font-semibold',
          activeTab === tab ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 컨텐츠 -->
    <div>
      <div v-if="activeTab === '주문 내역'">
        <div v-for="order in orders" :key="order.id" class="p-4 bg-white rounded-xl shadow mb-4">
          <p class="font-bold">{{ order.storeName }}</p>
          <p class="text-gray-500 text-sm">{{ order.date }}</p>
          <p class="mt-2">{{ order.items }}</p>
          <p class="font-semibold">{{ order.totalPrice }}원</p>
        </div>
      </div>

      <div v-if="activeTab === '리뷰 관리'">
        <div v-for="review in reviews" :key="review.id" class="p-4 bg-white rounded-xl shadow mb-4">
          <p class="font-bold">{{ review.storeName }}</p>
          <p class="text-gray-500">{{ review.content }}</p>
          <button class="text-blue-500 mr-2" @click="editReview(review.id)">수정</button>
          <button class="text-red-500" @click="deleteReview(review.id)">삭제</button>
        </div>
      </div>

      <div v-if="activeTab === '찜 목록'" class="grid grid-cols-2 gap-4">
        <div v-for="store in wishlist" :key="store.id" class="p-4 bg-white rounded-xl shadow">
          <img :src="store.image" class="w-full h-32 object-cover rounded-xl mb-2" />
          <p class="font-semibold">{{ store.name }}</p>
          <button class="mt-2 w-full bg-red-500 text-white py-1 rounded-lg">찜 해제</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

</script>

<style lang="scss" scoped>

</style>