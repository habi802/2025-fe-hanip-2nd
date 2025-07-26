<script setup>
import { inject, ref, reactive } from "vue";
import { activeStore, getOwnerStore } from "@/services/storeService";
import { useRouter } from "vue-router";

const router = useRouter();
const storeId = inject("storeId", ref(""));
const storeActive = inject("storeActive", ref(""));
const isOpen = inject("isOpen");

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

// 오늘 날짜
const formData = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

const today = ref(formData(new Date()))

// 영업시작
const start = async () => {
  if(storeActive.value) {
    showAlert("이미 가게가 영업 중입니다!")
    return;
  }
  const res = await activeStore(storeId.value);
  console.log("가게 아이디: ", storeId.value)
  if(res.status === 401 || res.status === 500) {
    showAlert("에러")
  }

  const updated = await getOwnerStore();
  if (updated.status === 200) {
    const newForm = updated.data.resultData;
    storeActive.value = newForm.isActive;
    if (isOpen) isOpen.value = newForm.isActive;
  }

  router.push("/owner/dashboard");
}
</script>

<template>
<!-- alert -->
  <div
    style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2000;
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

  <!-- 메인 -->
    <div class="container-fluid d-flex mb-5" style="height: 700px; padding-top: 81px;">
      <div class="card shadow p-5 w-100 text-center" style="max-width: 1300px;">
        <div class="ps-4 pt-5">
          <div class="text-date">{{ today }}</div>
          <div class="pb-5 text">오늘의 영업을 시작하세요!</div>
           <button class="storeAccept-btn" @click="start">영업 시작</button>
        </div>
      </div>
  </div>
</template>

<style scoped>
.box {
  font-family: "Pretendard", sans-serif;
  padding-top: 82px;
  justify-content: center;
}

.text-date {
  font-weight: bold;
  font-size: 60px;
  color: #959595
}

.text {
  font-weight: bold;
  font-size: 65px;
}

.storeAccept-btn {
  background: #f66463;
  border: none;
  color: white;
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 45px;
  width: 300px;
  height: 150px;
  transition: background-color 0.3s, color 0.3s;
}

.storeAccept-btn:hover {
  background: #d44b4a;
}
.storeAccept-btn:active {
  background: #b23837;
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
