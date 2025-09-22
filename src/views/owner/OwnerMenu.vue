<script setup>
import MenuDetail from "@/components/owner/MenuDetail.vue";
import MenuList from "@/components/owner/MenuList.vue";
import {
  getStoreIdAndMenus,
  getMenus,
  saveMenu,
  modifyMenu,
} from "@/services/menuService";
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
  const menuId = typeof menuOrId === "object" ? menuOrId.menuId : menuOrId;

  state.mode = "edit";
  const res = await getMenus(menuId);
  if (res?.status === 200) {
    state.selectedMenu = res.data?.resultData ?? null;
  } else {
    console.error("상세 조회 실패:", res);
  }
};

const handleAddMenu = () => {
  state.mode = "create";
  state.selectedMenu = null;
};

// 변환기
const toMenuOptionPostReq = (uiOptions = []) =>
  uiOptions.map((g) => ({
    comment: g.comment ?? "",
    price: 0,
    isRequired: g.isRequired ?? (g.category === "필수" ? 1 : 0),
    children: (g.children ?? g.values ?? []).map((v) => ({
      comment: v.comment ?? v.opt ?? "",
      price: Number(v.price ?? v.extra ?? 0),
    })),
  }));

const toMenuPutOptionPutReq = (uiOptions = []) =>
  uiOptions.map((g, idx) => ({
    optionId: g.id ?? null,
    comment: (g.comment ?? g.name ?? "").trim() || `옵션그룹${idx + 1}`,
    isRequired: g.isRequired ?? (g.category === "필수" ? 1 : 0),
    subOptions: (g.children ?? g.values ?? []).map((v) => ({
      optionId: v.id ?? null,
      comment: (v.comment ?? v.opt ?? "").trim(),
      price: Number(v.price ?? v.extra ?? 0),
    })),
  }));

// 페이로드 (바디)
const buildPostReq = (payload) => ({
  id: payload.menuId ?? null,
  name: payload.name,
  comment: payload.comment,
  price: payload.price,
  menuType: payload.menuType,
  menuOption: toMenuOptionPostReq(payload.options),
});

const buildPutReq = (payload) => ({
  menuId: payload.menuId,
  name: payload.name,
  price: payload.price,
  comment: payload.comment,
  menuType: payload.menuType,
  options: toMenuPutOptionPutReq(payload.options),
});

// 메뉴 등록 / 수정
const handleSaved = async (payload, file) => {
  const isEdit = state.mode === "edit";

  const reqBody = isEdit ? buildPutReq(payload) : buildPostReq(payload);

  console.log(
    `[REQ ${isEdit ? "PUT" : "POST"}]`,
    JSON.stringify(reqBody, null, 2)
  );

  const formData = new FormData();
  formData.append(
    "req",
    new Blob([JSON.stringify(reqBody)], { type: "application/json" })
  );
  if (file) {
    formData.append("pic", file);
  }

  const res = isEdit ? await modifyMenu(formData) : await saveMenu(formData);

  if (res?.status === 200) {
    await fetchMenus();
    if (isEdit && reqBody.menuId) {
      const d = await getMenus(reqBody.menuId);
      state.selectedMenu = d?.data?.resultData ?? null;
      showAlert("메뉴가 정상적으로 수정됐습니다.", "alert-success");
      
    } else {
      state.mode = "create";
      state.selectedMenu = null;
      showAlert("메뉴가 정상적으로 등록됐습니다.", "alert-success");
    }
  } else {
    console.error("저장 실패:", res);
    showAlert("저장에 실패했습니다.");
  }
};

onMounted(async () => {
  await fetchMenus();
});

// 부트스트랩 alert
let alertId = 0;

const alerts = reactive([]);

const showAlert = (message, type = "alert-danger") => {
  const id = ++alertId;
  const newAlert = { id, message, type };
  alerts.push(newAlert);

  // 자동 삭제 (3초 뒤)
  setTimeout(() => {
    removeAlert(id);
  }, 3000);
};

const removeAlert = (id) => {
  const index = alerts.findIndex((a) => a.id === id);
  if (index !== -1) alerts.splice(index, 1);
};
</script>

<template>
   <!-- alert -->
  <div style=" position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1055; " >
    <div  v-for="(alert, index) in alerts" :key="alert.id" :class="['alert', alert.type, 'alert-dismissible', 'fade', 'show']"
      role="alert" style="margin-bottom: 10px; min-width: 300px; max-width: 600px" >
      {{ alert.message }}
      <button  type="button" class="btn-close" @click="removeAlert(alert.id)" ></button>
    </div>
  </div>
  <!-- alert 끝 -->
   
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
        @saved="handleSaved"
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
