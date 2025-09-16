<script setup>
// address.vue props
const props = defineProps({
  address: Object,
  currentAddressId: Number,
});
// 이벤트 전달
const emit = defineEmits(["setCurrent", "edit"]);
// 현재 주소지로 설정(버튼 클릭 시 진행)
const setCurrent = () => emit("setCurrent", props.address.address_id);
// 수정 모달 열기
const openEdit = () => emit("edit", { ...props.address });
//삭제 버튼 클릭 시 emit 이벤트 추가
const deleteAddress = () => emit("delete", props.address.address_id);
</script>

<template>
  <div class="address-card" :class="{ active: address.address_id === currentAddressId }">
    <div class="card-header">
      <h3 class="card-title">{{ address.title }}</h3>
      <button
        class="current-btn"
        :class="{ active: address.address_id === currentAddressId }"
        @click="setCurrent"
      >
        현재 주소지 설정
      </button>
    </div>
    <p>우편번호 {{ address.postcode }}</p>
    <p>{{ address.address }}</p>
    <p>{{ address.address_detail }}</p>
    <div class="card-actions">
      <button class="primary-btn" @click="openEdit">수정</button>
      <button class="secondary-btn" @click="deleteAddress">삭제</button>
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
      transition: all 0.15s;

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
