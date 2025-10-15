<script setup>
import { ref, computed } from "vue";
import MenuListCard from "./MenuListCard.vue";

const searchQuery = ref("");
const activeTab = ref("전체");
const sortOption = ref("전체");

// 데이터
const props = defineProps({
  menus: { type: Array, default: () => [] },
});
const emit = defineEmits(["selectMenu", "add"]);

// 메뉴 종류 탭
const tabs = ["전체", "단품", "세트", "사이드", "음료수"];

const normalize = (t) => {
  const s = (t ?? "").toString().toLowerCase();
  if (s.includes("단품")) return "단품";
  if (s.includes("세트")) return "세트";
  if (s.includes("사이드")) return "사이드";
  if (s.includes("음료수") || s.includes("드링크")) return "음료수";
  return "기타";
};

// 고정 탭 및 검색
const groupedAll = computed(() => {
  const bucket = { 단품: [], 세트: [], 사이드: [], 음료수: [], 기타: [] };

  for (const g of props.menus ?? []) {
    const cat = normalize(g.menuType);
    bucket[cat].push(...(Array.isArray(g.menus) ? g.menus : []));
  }

  const q = searchQuery.value.trim().toLowerCase();
  const match = (m) =>
    !q ||
    (m.name ?? "").toLowerCase().includes(q) ||
    (m.comment ?? "").toLowerCase().includes(q);

  const ordered = ["단품", "세트", "사이드", "음료수"]
    .map((cat) => ({ menuType: cat, menus: bucket[cat].filter(match) }))
    .filter((g) => g.menus.length);

  const etc = bucket["기타"].filter(match);
  return etc.length ? [...ordered, { menuType: "기타", menus: etc }] : ordered;
});

// 탭 필터
const filteredGroups = computed(() => {
  let groups = activeTab.value === "전체"
    ? groupedAll.value
    : groupedAll.value.filter((g) => g.menuType === activeTab.value);

  if (sortOption.value === "가격 순") {
    groups = groups.map((g) => ({
      ...g,
      menus: [...g.menus].sort((a, b) => (a.price ?? 0) - (b.price ?? 0)),
    }));
  } else if (sortOption.value === "숨긴 메뉴") {
    groups = groups.map((g) => ({
      ...g,
      menus: g.menus.filter((m) => m.isHide === 0), // 숨김만
    })).filter((g) => g.menus.length);
  } else if (sortOption.value === "품절 메뉴") {
    groups = groups.map((g) => ({
      ...g,
      menus: g.menus.filter((m) => m.isSoldOut === 0), // 품절만
    })).filter((g) => g.menus.length);
  }

  return groups;
});
</script>

<template>
  <div class="menu-list">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <select v-model="sortOption" class="form-select" style="width: 150px">
        <option>전체</option>
        <option>가격 순</option>
        <option>숨긴 메뉴</option>
        <option>품절 메뉴</option>
      </select>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="검색"
        class="form-control"
      />
    </div>

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

    <div class="add-menu mb-3 text-center">
      <button class="btn-add" @click="emit('add')">+ 메뉴 추가하기</button>
    </div>

    <div class="menu-scroll scroll-bar">
      <template v-if="filteredGroups.length">
        <div
          v-for="(group, gi) in filteredGroups"
          :key="group.menuType ?? gi"
          class="mb-4"
        >
          <h5 class="fw-bold mb-2">{{ group.menuType }}</h5>

          <MenuListCard
            v-for="(menu, mi) in group.menus"
            :key="menu.menuId ?? `${group.menuType}-${mi}`"
            :menu="menu"
            class="menu-item"
            @select="emit('selectMenu', $event)"
          />
        </div>
      </template>
      <p v-else class="text-center mt-5 empty-text">
        <img 
        src="@/imgs/owner/owner-service6.png" 
        alt="빈 상태 이미지" 
        class="empty-img mb-3"
        />

        <br />

        {{
          searchQuery ? "검색 결과가 없습니다." : "등록된 메뉴가 없습니다."
        }}

<br />
      </p>
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
  max-width: 500px;
}

.menu-list {
  padding-left: 13px;
  height: 100%;
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
  max-height: 800px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}
.menu-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.menu-item:hover {
  background-color: #ff8989;
  color: #fff;
}

.empty-img {
  width: 250px;
  opacity: 0.6;
}

.empty-text {
  font-size: 20px;   
  font-weight: 500; 
  color: #9c9c9c;    
}

</style>
