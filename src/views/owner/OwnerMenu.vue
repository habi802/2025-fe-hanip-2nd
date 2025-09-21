<script setup>
import MenuDetail from "@/components/owner/MenuDetail.vue";
import MenuList from "@/components/owner/MenuList.vue";
import { getStoreIdAndMenus, getMenus } from "@/services/menuService";
import { onMounted, reactive } from "vue";

const state = reactive({
  menus: [],
  selectedMenu: null,
  mode: "create",
});

const fetchMenus = async () => {
  const res = await getStoreIdAndMenus();
  if (res?.status === 200) {
    state.menus = res.data?.resultData ?? [];
    console.log("res: ", res.data.resultData);
  } else {
    console.error("메뉴 조회 실패:", res);
  }
};

const handleSelectMenu = async (menuOrId) => {
  // 카드에서 객체를 넘기면 menuOrId.menuId, id만 넘기면 그대로 사용
  const menuId = typeof menuOrId === "object" ? menuOrId.menuId : menuOrId;

  state.mode = "edit";
  const res = await getMenus(menuId);
  if (res?.status === 200) {
    state.selectedMenu = res.data?.resultData ?? null; // ★ 상세도 resultData
  } else {
    console.error("상세 조회 실패:", res);
  }
};

const handleAddMenu = () => {
  state.mode = "create";
  state.selectedMenu = null;
};

onMounted(async () => {
  fetchMenus();
});
</script>

<template>
  <div class="d-flex">
    <!-- 왼쪽: 메뉴 리스트 -->
    <div class="section-left">
      <MenuList
        :menus="state.menus"
        @selectMenu="handleSelectMenu"
        @add="handleAddMenu"
      />
    </div>

    <!-- 오른쪽: 상세 -->
    <div class="section-right">
      <MenuDetail
        :key="state.selectedMenu?.menuId ?? 'create'"
        :menu="state.selectedMenu"
        :mode="state.mode"
        @saved="fetchMenus"
        @deleted="fetchMenus"
      />
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
