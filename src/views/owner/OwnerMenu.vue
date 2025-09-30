<script setup>
import MenuDetail from "@/components/owner/MenuDetail.vue";
import MenuList from "@/components/owner/MenuList.vue";
import {
  getStoreIdAndMenus,
  getOneMenu,
  saveMenu,
  modifyMenu,
  deleteMenu,
  modifiyMenuHide,
  modifiyMenuSoldOut
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
    showAlert("메뉴 불러오기에 실패했습니다.");
  }
};

const handleSelectMenu = async (menuOrId) => {
  const menuId = typeof menuOrId === "object" ? menuOrId.menuId : menuOrId;

  state.mode = "edit";
  const res = await getOneMenu(menuId);
  if (res?.status === 200) {
    state.selectedMenu = res.data?.resultData ?? null;
  } else {
    console.error("상세 조회 실패:", res);
    showAlert("해당 메뉴 불러오기에 실패했습니다.");
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
    console.log("pic", file)
  }

  const res = isEdit ? await modifyMenu(formData) : await saveMenu(formData);

  if (res?.status === 200) {
    await fetchMenus();
    if (isEdit && reqBody.menuId) {
      const d = await getOneMenu(reqBody.menuId);
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

// 삭제하기
const handleDeleted = async(menuId) => {
  // console.log("ㅎㅇ: ", menuId)
  const res = await deleteMenu(menuId);
  if (res?.status !== 200) {
    showAlert("삭제에 실패했습니다.");
    return;
  }
  await fetchMenus();

  if (state.selectedMenu?.menuId === menuId) {
    state.selectedMenu = null;
    state.mode = "create";
  }

  showAlert("메뉴가 정상적으로 삭제됐습니다.", "alert-success");
}

// 숨기기
const handleHide = async(payload) => {
  // console.log("req: ", payload)
  const newHide = payload.isHide === 1 ? 0 : 1;
  const req = { ...payload, isHide: newHide };

  const res = await modifiyMenuHide(req)
  if (res?.status !== 200) {
    showAlert("수정에 실패했습니다.");
    return;
  }

  const target = state.menus.find(m => m.menuId === req.menuId);
  if (target) {
      target.isHide = payload.isHide;
    }

  if (state.selectedMenu?.menuId === payload.menuId) {
    state.selectedMenu.isHide = newHide;
  }

  showAlert(
    !newHide ? "메뉴가 숨김 처리되었습니다." : "메뉴가 다시 표시되었습니다.",
    "alert-success"
  );
  await fetchMenus();
}

const handleSoldOut = async(payload) => {
  const newSoldOut = payload.isSoldOut === 1 ? 0 : 1;
  const req = { ...payload, isSoldOut: newSoldOut };

  const res = await modifiyMenuSoldOut(req)
  if (res?.status !== 200) {
    showAlert("수정에 실패했습니다.");
    return;
  }

  const target = state.menus.find(m => m.menuId === req.menuId);
  if (target) {
      target.isSoldOut = payload.isSoldOut;
    }

  if (state.selectedMenu?.menuId === payload.menuId) {
    state.selectedMenu.isSoldOut = newSoldOut;
  }

  showAlert(
    !newSoldOut ? "메뉴가 품절 처리되었습니다." : "메뉴가 판매중입니다.",
    "alert-success"
  );
  await fetchMenus();
}

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
  <div class="wrap">

    <!-- alert -->
    <div style=" position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1055; " >
      <div  v-for="(alert, index) in alerts" :key="alert.id" :class="['alert', alert.type, 'alert-dismissible', 'fade', 'show']"
        role="alert" style="margin-bottom: 10px; min-width: 300px; max-width: 600px" >
        {{ alert.message }}
        <button  type="button" class="btn-close" @click="removeAlert(alert.id)" ></button>
      </div>
    </div>
    <!-- alert 끝 -->
    
    <div class="d-flex gap-5">
      <!-- 왼쪽: 메뉴 리스트 -->
      <div class="section-left">
        <MenuList
          :menus="state.menus"
          @selectMenu="handleSelectMenu"
          @add="handleAddMenu"
        />
      </div>

      <!-- 오른쪽: 상세 -->
      <div class="section-right white-card ">
        <MenuDetail
          :key="state.selectedMenu?.menuId ?? 'create'"
          :menu="state.selectedMenu"
          :mode="state.mode"
          @saved="handleSaved"
          @deleted="handleDeleted"
          @hide="handleHide"
          @soldOut="handleSoldOut"
        />
      </div>
    </div>

  </div><!--wrap 끝-->
</template>

<style scoped lang="scss">
/* 왼쪽 영역 */
.section-left {
  //position: relative;
  //left: -3px;
  width: 50%;
  min-width: 740px;
  max-width: 800px;
  height: 100%;
  display: flex;
  flex-direction: column;
  //padding-right: 20px;
}

/* 오른쪽 영역 */
.section-right {
  width: 50%;
  min-width: 720px;
  max-width: 800px;
  height: 100%;
  min-height: 1000px;
  padding: 20px;
  overflow-y: auto;
}

.menu-item:hover {
  background-color: #f9fafb;
}

/* alert 에니메이션 */
.fade.show {
  animation: slideDown 0.5s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
