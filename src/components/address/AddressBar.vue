<script setup>
import { ref } from "vue";
import EditAddress from "@/components/address/EditAddress.vue";

// 🔹 모달 열림 상태 (추가용)
const addModalOpen = ref(false);

// 🔹 부모에게 emit할 이벤트 정의
const emit = defineEmits(["add"]);

// 🔹 새 주소 초기값 (모달 전달용)
const newAddress = ref({ title: "", postcode: "", address: "", address_detail: "" });

// 🔹 추가 버튼 클릭 → 부모에게 emit
const openAddModal = () => {
  // 모달 초기화
  newAddress.value = { title: "", postcode: "", address: "", address_detail: "" };
  addModalOpen.value = true;
};

// 🔹 모달 저장 이벤트 → 부모에게 emit
const handleAddAddress = (address) => {
  console.log("추가된 주소:", address);
  emit("add", address); // 부모(Address.vue)에 주소 전달
  addModalOpen.value = false; // 모달 닫기
};
</script>

<template>
  <div class="address-bar">
    <div class="container">
      <!-- 검색 input -->
      <div class="search-wrapper">
        <img src="@/imgs/location.png" alt="검색" class="search-icon" />
        <input
          type="text"
          placeholder="검색바 : 지번, 도로명, 건물명으로 검색"
          class="search-input"
        />
      </div>

      <!-- 현재 위치 버튼 -->
      <button class="location-btn" @click="addModalOpen = true">
        주소 추가
        <img src="@/imgs/gps.png" alt="위치" class="location-icon" />
      </button>
    </div>
  </div>

  <!-- 주소 추가 모달 -->
  <EditAddress
    :show="addModalOpen"
    :address="newAddress"
    mode="add"
    @close="addModalOpen = false"
    @save="handleAddAddress"
  />
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "Pretendard-Regular";
  src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
    format("woff");
  font-weight: 400;
  font-style: normal;
}

* {
  font-family: "Pretendard-Regular";
  font-size: 20px;
}

.address-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  .container {
    display: flex;
    align-items: center;
  }

  /* 검색 input 래퍼 */
  .search-wrapper {
    position: relative;
    flex: 1;
    width: 1000px;
    margin-right: 20px;

    .search-icon {
      position: absolute;
      left: 30px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 30px;
      pointer-events: none; // 아이콘 클릭 시 input이 클릭되도록
    }

    .search-input {
      width: 100%;
      height: 60px;
      padding: 0.75rem 1rem 0.75rem 50px; // 왼쪽 padding 넉넉히
      border: 2px solid #ff6666;
      border-radius: 20px;
      text-align: center;

      &::placeholder {
        color: #ff6666;
      }
    }
  }

  /* 현재 위치 버튼 */
  .location-btn {
    height: 60px;
    width: 200px;
    background-color: #ff6666;
    color: #fff;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px; // 버튼 텍스트와 아이콘 사이 간격

    .location-icon {
      width: 24px;
      height: 24px;
    }

    &:hover {
      background-color: darken(#ff6666, 5%);
    }
  }
}
</style>
