<script>
// 페이지네이션, 현재 사용 x (부트스트랩으로 사용)
import { computed, ref, reactive, onMounted, inject,watch } from "vue";


// 페이지네이션 관련
const currentPage = ref(1); // 현재 페이지
const pageSize = 6; // 페이지당 리뷰 개수

const totalPages = computed(() => {
  return Math.ceil(reviewStore.reviews.length / pageSize);
});

// 현재 페이지에 맞는 리뷰 목록
// const pagedReviews = computed(() => {
//   const start = (currentPage.value - 1) * pageSize;
//   const end = start + pageSize;
//   return reviewStore.reviews.slice(start, end);
// });

// 페이지네이션 숫자 계산
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

</script>

<template>
  <!-- 페이지네이션 버튼 -->
  <div class="pagination d-flex justify-content-center mt-4 align-items-center gap-3">
    <!-- 이전 버튼 -->
    <span
      class="page-arrow"
      @click="goToPage(currentPage - 1)"
      :class="{ disabled: currentPage === 1 }"
    >
      &lt;
    </span>

    <!-- 숫자 버튼 -->
    <span
      v-for="page in pageNumbers"
      :key="page"
      class="page-number"
      :class="{ active: currentPage === page }"
      @click="goToPage(page)"
    >
      {{ page ||  "-"}}
    </span>

    <!-- 다음 버튼 -->
    <span
      class="page-arrow"
      @click="goToPage(currentPage + 1)"
      :class="{ disabled: currentPage === totalPages }"
    >
      &gt;
    </span>
  </div>

</template>

<style lang="scss" scoped>

</style>