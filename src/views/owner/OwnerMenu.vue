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
  height: 100vh;
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
  height: 100%;
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

.menu-item:hover {
  background-color: #f9fafb;
}
</style>
