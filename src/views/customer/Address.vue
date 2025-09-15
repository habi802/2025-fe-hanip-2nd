<script setup>
import { ref, computed } from "vue";
import AddressBar from "@/components/address/AddressBar.vue";
import AddressCard from "@/components/address/AddressCard.vue";
import EditAddress from "@/components/address/EditAddress.vue";

// 임시 주소 데이터
const addresses = [
  {
    address_id: 1,
    title: "우리집",
    postcode: "414987",
    address: "대구 중구 국채보상로 55",
    address_detail: "502호",
  },
  {
    address_id: 2,
    title: "회사",
    postcode: "414987",
    address: "대구 중구 국채보상로 56",
    address_detail: "502호",
  },
  {
    address_id: 3,
    title: "어디로든 문",
    postcode: "414987",
    address: "대구 중구 국채보상로 57",
    address_detail: "502호",
  },
  {
    address_id: 4,
    title: "뽱",
    postcode: "414987",
    address: "대구 중구 국채보상로 58",
    address_detail: "502호",
  },
  {
    address_id: 5,
    title: "친구집",
    postcode: "414987",
    address: "대구 중구 국채보상로 59",
    address_detail: "502호",
  },
];

// 보여줄 개수
const showCount = ref(4);

// 현재 주소지 선택
const currentAddressId = ref(
  localStorage.getItem("currentAddressId")
    ? Number(localStorage.getItem("currentAddressId"))
    : 1 // 회원가입 시 기본 주소
);

const setCurrentAddress = (id) => {
  currentAddressId.value = id;
  localStorage.setItem("currentAddressId", id); // 변경 시 로컬 스토리지에 저장
};

// 수정 모달 관리
const showModal = ref(false);
const selectedAddress = ref({}); // 수정 모달용 선택 주소
const modalMode = ref("edit"); // edit / add

// 모달 열기 (수정)
const openEditModal = (addr) => {
  selectedAddress.value = { ...addr };
  showModal.value = true;
};

// 모달 열기 (추가)
const openAddModal = () => {
  selectedAddress.value = {}; // 초기화
  showModal.value = true;
};

// 수정 저장
const saveAddress = (updatedAddr) => {
  if (updatedAddr.mode === "add") {
    // 새로운 주소 추가
    addresses.value.push({ ...updatedAddr, address_id: Date.now() });
  } else {
    // 기존 주소 수정
    const index = addresses.value.findIndex(
      (a) => a.address_id === updatedAddr.address_id
    );
    if (index !== -1) addresses.value[index] = updatedAddr;
  }
};

// 주소 삭제
const deleteAddress = (id) => {
  addresses.value = addresses.value.filter((a) => a.address_id !== id);
};

// 현재 선택 주소 맨 앞으로 정렬
const sortedAddresses = computed(() => {
  if (!currentAddressId.value) return addresses;
  const current = addresses.filter((a) => a.address_id === currentAddressId.value);
  const others = addresses.filter((a) => a.address_id !== currentAddressId.value);
  return [...current, ...others];
});

// 보여줄 주소 리스트 (showCount만큼)
const visibleAddresses = computed(() => sortedAddresses.value.slice(0, showCount.value));

// 더보기 버튼
const loadMore = () => (showCount.value += 4);
</script>

<template>
  <div class="address">
    <div class="container">
      <h2 class="add-title">주소 설정</h2>
      <div class="titleLine"></div>

      <!-- 검색바 -->
      <AddressBar />

      <!-- 주소 카드 리스트 -->
      <div class="address-list">
        <AddressCard
          v-for="addr in visibleAddresses"
          :key="addr.address_id"
          :address="addr"
          :currentAddressId="currentAddressId"
          @setCurrent="setCurrentAddress"
          @edit="openEditModal"
        />
      </div>

      <!-- 더보기 버튼 -->
      <div class="plus" v-if="showCount < addresses.length">
        <button class="plus-btn" @click="loadMore">더보기</button>
      </div>
    </div>

    <!-- 수정 모달 -->
    <EditAddress
      :show="showModal"
      :address="selectedAddress"
      @close="showModal = false"
      @save="saveAddress"
    />
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "BMJUA";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
}

.add-title {
  font-family: "BMJUA";
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  margin-top: 5rem;
  margin-bottom: 40px;
}
// 메인 구분 선
.titleLine {
  width: 100%;
  border-bottom: 3px solid #000;
  margin: 0 auto 3rem;
}
// 카드 리스트 배치
.address-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  justify-items: center;
  margin-bottom: 5rem;
}
// 더보기 버튼
.plus {
  display: flex;
  justify-content: center;
  .plus-btn {
    font-family: "BMJUA";
    width: 150px;
    height: 60px;
    background-color: #ff6666;
    color: white;
    border: none;
    border-radius: 18px;
    margin-bottom: 5rem;
    cursor: pointer;
    font-size: 20px;

    &:hover {
      background-color: darken(#ff6666, 5%);
    }
  }
}
</style>
