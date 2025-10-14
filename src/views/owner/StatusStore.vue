<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { useOwnerStore } from "@/stores/account";
import { modify } from "@/services/storeService";
import StoreStatusStaticInfo from "@/components/owner/StoreStatusStaticInfo.vue";
import StoreStatusControl from "@/components/owner/StoreStatusControl.vue";

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

const owner = useOwnerStore();

const state = reactive({
  form: {
    dynamic: {
      isOpen: owner.state.storeData.isOpen,
      openTime: owner.state.storeData.openTime,
      closeTime: owner.state.storeData.closeTime,
      closedDay: owner.state.storeData.closedDay,
      minDeliveryFee: owner.state.storeData.minDeliveryFee,
      maxDeliveryFee: owner.state.storeData.maxDeliveryFee,
      minAmount: owner.state.storeData.minAmount,
      isPickUp: owner.state.storeData.isPickUp,
      eventComment: owner.state.storeData.eventComment,
    },
    static: {
      tel1: owner.state.storeData.tel.split("-")[0],
      tel2: owner.state.storeData.tel.split("-")[1],
      tel3: owner.state.storeData.tel.split("-")[2],
      imagePath: owner.state.storeData.imagePath,
      bannerPath: owner.state.storeData.bannerPath,
      comment: owner.state.storeData.comment,
      categories: owner.state.storeData.categories,
    },
  },
});

const selected = ref("control");

// 가게 정보 저장
const updateStore = async () => {
  const cats = state.form.static.categories;
  if (!cats || cats.length === 0) {
    showAlert("최소 하나의 카테고리는 선택하셔야 합니다.");
    return;
  }
  console.log("state.form", state.form);

  const formData = new FormData();

  const tel = `${state.form.static.tel1}-${state.form.static.tel2}-${state.form.static.tel3}`;

  const payload = {
    id: owner.state.storeData.id,
    isOpen: state.form.dynamic.isOpen,
    openTime: state.form.dynamic.openTime,
    closeTime: state.form.dynamic.closeTime,
    dayOfWeek: state.form.dynamic.closedDay,
    minDeliveryFee: state.form.dynamic.minDeliveryFee,
    maxDeliveryFee: state.form.dynamic.maxDeliveryFee,
    minAmount: state.form.dynamic.minAmount,
    isPickUp: state.form.dynamic.isPickUp,
    eventComment: state.form.dynamic.eventComment,
    tel: tel,
    comment: state.form.static.comment,
    storeCategory: state.form.static.categories,
  };

  formData.append("pic", state.form.static.imagePath);
  formData.append("bannerPic", state.form.static.bannerPath);
  formData.append(
    "req",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );

  const res = await modify(formData);
  if (res !== undefined && res.status === 200) {
    await owner.fetchStoreInfo();
    console.log("data: ", owner.state.storeData);
    showAlert("정상적으로 수정되었습니다.", "alert-success");
    console.log("수정 완료");
  }
};

const hydrateFormFromStore = () => {
  const data = owner.state.storeData ?? {};
  state.form.dynamic = data;

  const [t1 = "", t2 = "", t3 = ""] = (data.tel ?? "").split("-");
  state.form.static = {
    tel1: t1,
    tel2: t2,
    tel3: t3,
    imagePath: data.imagePath,
    bannerPath: data.bannerPath,
    comment: data.comment,
    categories: data.categories ?? data.storeCategory,
  };
};

watch(
  () => owner.state.storeData,
  () => hydrateFormFromStore(),
  { immediate: true } // deep 제거
);
</script>

<template>
  <!-- alert -->
  <div
    style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1055;
    "
  >
    <div
      v-for="(alert, index) in alerts"
      :key="alert.id"
      :class="['alert', alert.type, 'alert-dismissible', 'fade', 'show']"
      role="alert"
      style="margin-bottom: 10px; min-width: 300px; max-width: 600px"
    >
      {{ alert.message }}
      <button
        type="button"
        class="btn-close"
        @click="removeAlert(alert.id)"
      ></button>
    </div>
  </div>
  <!-- alert 끝 -->

  <div class="section-wrap">
    <div class="btn-group gap-3" role="group">
      <button
        type="button"
        class="submenu-btn"
        :class="selected === 'control' ? 'submenu-active' : 'submenu-none'"
        @click="selected = 'control'"
      >
        운영관리
      </button>
      <button
        type="button"
        class="submenu-btn"
        :class="selected === 'basic' ? 'submenu-active' : 'submenu-none'"
        @click="selected = 'basic'"
      >
        기본정보
      </button>
    </div>

    <div class="white-card">
      <StoreStatusControl
        v-if="selected === 'control'"
        :form="state.form.dynamic"
        @update-form="(val) => Object.assign(state.form.dynamic, val)"
      />
      <StoreStatusStaticInfo
        v-if="selected === 'basic'"
        :is-active="owner.state.storeData.isActive"
        :form="state.form.static"
        @update-form="(val) => Object.assign(state.form.static, val)"
      />
      <div class="btn-wrap">
        <span>** 가게 정보 수정 시 내용을 꼭 확인해주세요.** </span>
        <div class="button-row">
          <button type="button" class="owner-btn-white" @click="updateStore">
            저장하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-wrap {
  width: 95%;
  display: flex;
  flex-direction: column;
  /* justify-content: center; <-- 제거 */
  align-items: center;
  padding-top: 8px; /* 살짝만 상단 여백(원하면 0) */
}

.white-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 40px;
}

.btn-group {
  align-self: flex-start;
  margin-left: 5%;
}

/* 버튼 바: 카드 하단에 붙이고 싶을 때만 margin-top:auto */
.btn-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 10px 0 30px;
  margin-top: auto;

  span {
    display: block;
    text-align: center;
    color: var(--primary);
  }

  .button-row {
    display: flex;
    gap: 20px;
    justify-content: center;
    width: 100%;
  }

  button {
    width: 120px;
  }
}

/* alert 에니메이션은 그대로 유지 */
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
