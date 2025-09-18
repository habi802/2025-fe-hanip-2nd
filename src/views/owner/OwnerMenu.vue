<script setup>
import MenuDetail from "@/components/owner/MenuDetail.vue";
import MenuList from "@/components/owner/MenuList.vue";
</script>

<template>
  <div class="d-flex">
    <!-- 왼쪽: 메뉴 리스트 -->
    <div class="section-left">
      <MenuList />
    </div>

    <!-- 오른쪽: 상세 -->
    <div class="section-right">
      <MenuDetail />
    </div>
  </div>
</template>

<style scoped lang="scss">
.d-flex {
  height: 100vh; /* 전체 높이 맞추기 */
  position: relative;
  top: -40px;
  gap: 20px;
}

/* 왼쪽 영역 */
.section-left {
  position: relative;
  left: -3px;
  width: 50%;
  min-width: 740px;
  max-width: 800px;
  height: 100%; /* 화면 꽉 차게 */
  display: flex;
  flex-direction: column;
  padding-right: 20px;
 
}

/* 오른쪽 영역 */
.section-right {
  width: 50%;
  min-width: 720px;
  max-width: 800px;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background: #fff;
  border-radius: 12px;
}

/* 메뉴 카드 공통 사이즈 */
.menu-item {
  width: 693px; /* ✅ 고정 폭 */
  height: 130px; /* ✅ 고정 높이 */
  margin-bottom: 15px;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer; 
}

.menu-item:hover {
  background-color: #f9fafb;
}
</style>
