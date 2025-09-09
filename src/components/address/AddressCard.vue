<script setup>
import { reactive, ref, onMounted } from "vue";
import { addAddress } from "@/services/addressService";
import AlertModal from "@/components/modal/AlertModal.vue";

const alertModal = ref(null);

// 반복용 주소 리스트 상태
const state = reactive({
  addresses: [], // 서버에서 불러올 주소 리스트
  currentAddressId: null, // 현재 주소 선택
  add: {
    // 새 주소 입력용 폼
    title: "",
    postcode: "",
    address: "",
    addressDetail: "",
  },
});
</script>

<template>
  <div class="address">
    <div class="container">
      <div class="address-list">
        <div v-for="addr in state.addresses" :key="addr.address_id" class="address-card">
          <!-- 수정: 카드 헤더 추가 (제목 + 버튼 나란히) -->
          <div class="card-header">
            <h3 class="card-title">{{ add.title }}</h3>
            <button
              class="current-btn"
              :class="{ active: addr.address_id === currentAddressId }"
              @click="setCurrentAddress(addr.address_id)"
            >
              현재 주소지 설정
            </button>
          </div>

          <!-- 카드 내용 -->
          <h3 class="card-title">{{ addr.title }}</h3>
          <p>우편번호 {{ addr.postcode }}</p>
          <p>{{ addr.address }}</p>
          <p>{{ addr.addressDetail }}</p>

          <!-- 카드 액션 버튼 -->
          <div class="card-actions">
            <button class="primary-btn">수정</button>
            <button class="secondary-btn">삭제</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 카드 노출 형태
.address-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  justify-items: center; // 가운데 정렬
  margin-bottom: 5rem;
}
// 카드 전체 스타일
.address-card {
  width: 100%;
  max-width: 700px;
  border: 1px solid #797979;
  border-radius: 20px;
  padding: 1.5rem;
  background: #fff;
  position: relative;
  transition: border 0.2s, box-shadow 0.2s;

  &.active {
    border-color: #ff6666;
    box-shadow: 0 4px 12px rgba(255, 102, 102, 0.2);
  }

  // 카드 헤더
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    // 카드 주소지 타이틀
    .card-title {
      font-size: 24px;
      font-weight: 600;
    }
    // 현재 주소지 설정 버튼
    .current-btn {
      width: 250px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      border: 1px solid #ff6666;
      background-color: white;
      color: #ff6666;
      transition: all 0.2s;

      &:hover {
        background-color: #ffe6e6;
      }

      &.active {
        background-color: #ff6666;
        color: white;
        border: none;
      }
    }
  }
  // 상세 주소지
  p {
    font-size: 20px;
    margin-bottom: 10px;
  }
  // 수정 삭제 버튼
  .card-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    .primary-btn {
      width: 100px;
      height: 40px;
      background-color: #ff6666;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        background-color: darken(#ff6666, 5%);
      }
    }

    .secondary-btn {
      width: 100px;
      height: 40px;
      background-color: white;
      color: #ff6666;
      border: 1.5px solid #ff6666;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        background-color: #ffe6e6;
      }
    }
  }
}
</style>
