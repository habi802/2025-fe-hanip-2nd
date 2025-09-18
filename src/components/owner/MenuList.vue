<script setup>
import { ref, computed } from "vue";
import MenuListCard from "./MenuListCard.vue";

const menus = [
  {
    id: 1,
    name: "1인 순살닭도리탕 세트",
    price: 13900,
    desc: "100% 닭다리살 + 각종 재료",
    img: "menu1.jpg",
    category: "단품메뉴",
  },
  {
    id: 2,
    name: "골드덤 2인세트",
    price: 25000,
    desc: "국물찜닭 + 추가재료",
    img: "menu2.jpg",
    category: "세트메뉴",
  },
  {
    id: 3,
    name: "사이드 감자튀김",
    price: 5000,
    desc: "바삭바삭 감자튀김",
    img: "menu3.jpg",
    category: "사이드메뉴",
  },
  {
    id: 4,
    name: "사이드 감자튀김",
    price: 5000,
    desc: "바삭바삭 감자튀김",
    img: "menu3.jpg",
    category: "사이드메뉴",
  },
  {
    id: 4,
    name: "사이드 감자튀김",
    price: 5000,
    desc: "바삭바삭 감자튀김",
    img: "menu3.jpg",
    category: "사이드메뉴",
  },

];

const activeTab = ref("전체");
const searchQuery = ref("");

const tabs = ["전체", "단품메뉴", "세트메뉴", "사이드메뉴", "음료"];

// ✅ 검색 필터 적용
const searchedMenus = computed(() => {
  if (!searchQuery.value) return menus;
  const q = searchQuery.value.toLowerCase();
  return menus.filter(
    (m) => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)
  );
});

// ✅ 카테고리별 그룹화
const groupedMenus = computed(() => {
  const groups = {};
  searchedMenus.value.forEach((menu) => {
    if (!groups[menu.category]) groups[menu.category] = [];
    groups[menu.category].push(menu);
  });
  return groups;
});

// ✅ 특정 탭 선택 시 메뉴
const filteredMenus = computed(() => {
  if (activeTab.value === "전체") return searchedMenus.value;
  return searchedMenus.value.filter((m) => m.category === activeTab.value);
});
</script>

<template>
  <div class="menu-list">
    <!-- 상단 카테고리 & 검색 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <select class="form-select" style="width: 150px;">
        <option>메뉴전체</option>
        <option>카테고리별</option>
        <option>이름 순</option>
        <option>월 등록 기간</option>
      </select>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="검색"
        class="form-control"
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
      <!-- 전체일 때 -->
      <template v-if="activeTab === '전체'">
        <template v-if="searchedMenus.length > 0">
          <div
            v-for="(menus, category) in groupedMenus"
            :key="category"
            class="mb-4"
          >
            <h5 class="fw-bold mb-2">{{ category }}</h5>
            <MenuListCard
              v-for="menu in menus"
              :key="menu.id"
              :menu="menu"
              class="menu-item"
            />
          </div>
        </template>
        <p v-else class="empty-message">검색 결과가 없습니다.</p>
      </template>

      <!-- 특정 탭일 때 -->
      <template v-else>
        <template v-if="filteredMenus.length > 0">
          <h5 class="fw-bold mb-2">{{ activeTab }}</h5>
          <MenuListCard
            v-for="menu in filteredMenus"
            :key="menu.id"
            :menu="menu"
            class="menu-item"
          />
        </template>
        <p v-else class="text-center text-muted mt-5">검색 결과가 없습니다.</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.form-select {
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  height: auto;
  width: 180px;
  margin-right: 15px; 
}

.form-control {
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  height: auto;
  max-width: 500px; /* 🔹 검색창 길이 제한 */
}

.menu-list {
  height: 100vh; /* 부모 고정 */
  display: flex;
  flex-direction: column;
  overflow: visible;
}

/* 탭 버튼 */
.menu-tabs {
  border-bottom: 1px solid #eee;
}
.tab-btn {
  background: none;
  border: none;
  font-weight: 600;
  font-size: 20px;
  padding: 12px 6px;  
  padding-bottom: 8px;
  cursor: pointer;
}
.tab-btn.active {
  color: #e74c3c;
  border-bottom: 3px solid #e74c3c;
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
  background-color: #ffff;
}

/* 리스트 스크롤 */
.menu-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* 스크롤 정상 작동 */
}
.menu-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.menu-item:hover {
  background-color: #FF8989;
  color: #fff;
}


</style>
