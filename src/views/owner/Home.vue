<script setup>
import { inject, ref } from "vue";
import { activeStore } from "@/services/storeService";
import { useRouter } from "vue-router";

const router = useRouter();
const storeId = inject("storeId", ref(""));
const storeActive = inject("storeActive", ref(""));


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
    alert("이미 가게가 영업 중입니다!")
    return;
  }
  const res = activeStore(storeId.value);
  console.log("가게 아이디: ", storeId.value)
  if(res.status === 401 || res.status === 200) {
    alert("에러")
  } 
  await router.push("/")
  router.push("/owner/dashboard")
}
</script>

<template>
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

<style>
.box {
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

body {
  font-family: "Noto Sans KR", sans-serif;
}
</style>
