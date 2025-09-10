<script setup>
import { ref, watch, nextTick } from "vue";

// props 정의
const props = defineProps({
  show: Boolean, // 모달 표시 여부
  address: Object, // 수정할 주소 데이터
});

const emits = defineEmits(["close", "save"]);

// 로컬 상태 (수정용)
const form = ref({ ...props.address });

// 기본 지도 좌표 (서울시청)
let lat = 37.5665;
let lon = 126.978;

// props.address 변경 시 form 업데이트
watch(
  () => props.address,
  (newVal) => {
    form.value = { ...newVal };
  },
  { immediate: true }
);

// 모달 열릴 때 기본 지도 표시
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        showMap(form.value.address || "서울시청"); // 기존 주소가 있으면 표시
      });
    }
  }
);

// 저장 버튼 클릭
const handleSave = () => {
  emits("save", form.value);
  emits("close");
};

// 주소 검색
const addressSearch = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      // 주소 값 채우기
      form.value.postcode = data.zonecode;
      form.value.address = data.roadAddress;

      // 상세주소 input에 포커스
      nextTick(() => {
        const detailInput = document.querySelector("input[placeholder='상세 주소']");
        detailInput?.focus();
      });

      // 지도에 검색된 주소 표시
      showMap(data.roadAddress);
    },
  }).open();
};

const markerRef = ref(null); // 마커를 저장

const showMap = (address) => {
  // 먼저 지도 생성 (초기 좌표는 서울시청)
  const map = new naver.maps.Map("map", {
    center: new naver.maps.LatLng(lat, lon),
    zoom: 15,
  });

  // geocode로 주소 → 좌표
  naver.maps.Service.geocode({ query: address }, function (status, response) {
    if (status !== naver.maps.Service.Status.OK) return;
    const result = response.v2.addresses[0];
    if (!result) return;

    const point = new naver.maps.LatLng(result.y, result.x);
    lat = result.y;
    lon = result.x;

    // 지도 중심 이동
    map.setCenter(point);

    // 기존 마커가 있으면 제거
    if (markerRef.value) markerRef.value.setMap(null);

    // 마커 생성 및 ref 저장
    markerRef.value = new naver.maps.Marker({
      map: map,
      position: point,
    });

    // 지도 클릭 이벤트
    naver.maps.Event.addListener(map, "click", function (e) {
      markerRef.value.setPosition(e.coord);
      form.value.address_detail = `위도: ${e.coord
        .lat()
        .toFixed(6)}, 경도: ${e.coord.lng().toFixed(6)}`;
    });
  });
};

// 지도 표시
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        const targetAddress = form.value.address || "서울시청";
        showMap(targetAddress); // 기존 주소 있으면 마커 표시
      });
    }
  }
);
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>주소 수정</h2>

      <!-- 지도 영역 -->
      <div id="map"></div>

      <!-- 주소 입력 -->
      <input v-model="form.title" placeholder="주소 제목" />
      <div class="postcode-wrapper">
        <input
          class="postcode-input"
          v-model="form.postcode"
          placeholder="우편번호"
          readonly
        />
        <button @click="addressSearch" class="location-btn">주소 검색</button>
      </div>
      <input v-model="form.address" placeholder="주소" readonly />
      <input v-model="form.address_detail" placeholder="상세 주소" />

      <!-- 안내 문구 -->
      <span>
        입력된 공동 현관 비밀 번호는 원활한 배달을 위해 필요한 정보로, 배달을 진행하는
        라이더와 사장님께만 전달됩니다.
      </span>

      <!-- 버튼 영역 -->
      <div class="modal-actions">
        <button class="cancle-btn" @click="$emit('close')">취소</button>
        <button class="save-btn" @click="handleSave">저장</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#map {
  width: 700px;
  height: 400px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  h2 {
    text-align: center;
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    width: 850px;
    height: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;

    input:not(.postcode-input) {
      width: 700px;
      height: 60px;
      border: 1px solid #c8c8c8;
      margin-bottom: 20px;
      border-radius: 8px;
      padding: 15px 15px;
    }

    input:read-only {
      background-color: #f5f5f5;
      cursor: default;
      pointer-events: none;
      color: #7d7d7d;
    }

    .location-btn {
      width: 130px;
      height: 60px;
      background-color: white;
      color: #ff6666;
      border: 1.5px solid #ff6666;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        background-color: #ffe6e6;
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
      gap: 30px;

      .cancle-btn {
        width: 330px;
        height: 70px;
        background-color: #ff6666;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background-color: darken(#ff6666, 5%);
        }
      }

      .save-btn {
        width: 330px;
        height: 70px;
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

  span {
    width: 700px;
    color: #bcbcbc;
    font-weight: 600;
    font-size: 20px;
  }
}

.postcode-wrapper {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  .postcode-input {
    width: 560px;
    height: 60px;
    border: 1px solid #c8c8c8;
    border-radius: 8px;
    padding: 15px;
  }

  .location-btn {
    width: 130px;
    height: 60px;
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
</style>
