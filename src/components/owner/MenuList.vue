<script setup>
import { ref, computed } from "vue";
import MenuListCard from './MenuListCard.vue';

const menus = [
  { id: 1, name: "1인 순살닭도리탕 세트", price: 13900, desc: "100% 닭다리살 + 각종 재료", img: "menu1.jpg", category: "단품메뉴" },
  { id: 2, name: "골드덤 2인세트", price: 25000, desc: "국물찜닭 + 추가재료", img: "menu2.jpg", category: "세트메뉴" },
  { id: 3, name: "사이드 감자튀김", price: 5000, desc: "바삭바삭 감자튀김", img: "menu3.jpg", category: "사이드메뉴" },
];

const activeTab = ref("전체");
const searchQuery = ref("");

const tabs = ["전체", "단품메뉴", "세트메뉴", "사이드메뉴", "음료"];

// 검색 필터 적용
const searchedMenus = computed(() => {
  if (!searchQuery.value) return menus;
  const q = searchQuery.value.toLowerCase();
  return menus.filter(
    m =>
      m.name.toLowerCase().includes(q) ||
      m.desc.toLowerCase().includes(q)
  );
});

// 카테고리별 그룹화
const groupedMenus = computed(() => {
  const groups = {};
  searchedMenus.value.forEach(menu => {
    if (!groups[menu.category]) groups[menu.category] = [];
    groups[menu.category].push(menu);
  });
  return groups;
});

// 특정 탭 선택 시 메뉴
const filteredMenus = computed(() => {
  if (activeTab.value === "전체") return searchedMenus.value;
  return searchedMenus.value.filter(m => m.category === activeTab.value);
});
</script>

<template>
  <div class="menu-list">
    <!-- 상단 카테고리 & 검색 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <select>
        <option>메뉴전체</option>
        <option>세트메뉴</option>
        <option>사이드메뉴</option>
      </select>
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="검색" 
        class="form-control w-50" 
      />
    </div>

    <!-- 상단: 카테고리 탭 -->
    <div class="menu-tabs d-flex gap-4 mb-3">
      <button 
        v-for="tab in tabs" 
        :key="tab" 
        class="tab-btn" 
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 메뉴 추가 버튼 -->
    <div class="add-menu mb-3 text-center">
      <button class="btn-add">+ 메뉴 추가하기</button>
    </div>

    <!-- 메뉴 리스트 -->
    <div class="menu-scroll">
      <!-- 전체일 때 그룹별 출력 -->
      <template v-if="activeTab === '전체'">
        <div v-for="(menus, category) in groupedMenus" :key="category" class="mb-4">
          <h5 class="fw-bold mb-2">{{ category }}</h5>
          <MenuListCard 
            v-for="menu in menus" 
            :key="menu.id" 
            :menu="menu" 
            class="menu-item"
          />
        </div>
      </template>

      <!-- 특정 탭일 때 -->
      <template v-else>
        <h5 class="fw-bold mb-2">{{ activeTab }}</h5>
        <MenuListCard 
          v-for="menu in filteredMenus" 
          :key="menu.id" 
          :menu="menu" 
          class="menu-item"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.menu-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

/* 탭 버튼 */
.menu-tabs {
  border-bottom: 1px solid #eee;
}
.tab-btn {
  background: none;
  border: none;
  font-weight: 600;
  padding-bottom: 8px;
  cursor: pointer;
}
.tab-btn.active {
  color: #e74c3c;
  border-bottom: 2px solid #e74c3c;
}

/* 메뉴 추가 버튼 */
.btn-add {
  background-color: #f8f9fa;
  border: 1px dashed #ccc;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
}
.btn-add:hover {
  background-color: #f1f3f5;
}

/* 리스트 스크롤 */
.menu-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}
.menu-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.menu-item:hover {
  background-color: #f9fafb;
}
</style>
