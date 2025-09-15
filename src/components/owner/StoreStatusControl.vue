<script>
import {ref} from "vue";
// 영업 버튼 토글
const isOpen = ref(false);

const toggleBusiness = async () => {
  const storeId = state.form.id;
  const willOpen = !isOpen.value;

  const confirmMessage = willOpen
    ? "가게 영업을 시작하시겠습니까?"
    : "가게 영업을 중지하겠습니까?";

  if (confirm(confirmMessage)) {
    await activeStore(storeId);

    const res = await getOwnerStore();
    if (res.status === 200) {
      state.form = res.data.resultData;
      isOpen.value = state.form.isActive;

      // 상태에 따라 경로 이동
      if (isOpen.value) {
        router.push("/owner/dashboard");
      } else {
        router.push("/owner");
      }
    }
  } else {
  }
};
</script>
<template>
  <div>
    <div class="control-wrap">
      <!-- 토글버튼 -->
      <span>영업중</span>
      <div class="toggle-container" style="height: 40px" >
        <label class="switch">
          <input type="checkbox"/>
          <span class="slider"></span>
        </label>
      </div>
      
      <span>운영시간</span>
      <div class="d-flex gap-3">
        <input class="gray-content" type="text">
        <span>~</span>
        <input class="gray-content" type="text">
      </div>
      
      <span>휴무일 지정</span>
      <div class="d-flex gap-3">
        <label><input type="checkbox">월</input></label>
        <label><input type="checkbox">화</input></label>
        <label><input type="checkbox">수</input></label>
        <label><input type="checkbox">목</input></label>
        <label><input type="checkbox">금</input></label>
        <label><input type="checkbox">토</input></label>
        <label><input type="checkbox">일</input></label> 
      </div>

      <span>배달 최소 주문금액</span>
      <label for="minOrderPrice"> <input class="gray-content" id="minOrderPrice" type="text"  placeholder="원 이상 주문가능"></label>

      <!-- 토글버튼 -->
      <span>포장주문가능</span>
      <div class="toggle-container" style="height: 40px" >
        <label class="switch">
          <input type="checkbox"/>
          <span class="slider"></span>
        </label>
      </div>

      <span>가게 이벤트 공지</span>
      <textarea class="gray-content" name="" id="" placeholder="최대 500자 이하 재료소진, 배달지연, 이벤트 안내 등 설정해보세요!"></textarea>
      
    </div>
    <div class="btn-wrap">
        <span>** 가게 정보 수정 시 내용을 꼭 확인해주세요.** </span>
        <div class="button-row">
          <button class="btn-cancle">취소</button>
          <button class="hn-btn-white">저장하기</button>
        </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.control-wrap{
  display: grid;
  grid-template-columns: 150px 2fr;
  gap: 20px 50px;
  span{
    display: flex;
    align-items: center;
  }
}
.btn-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 30px 0;
  
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
    //flex: 0 0 auto; // 여기는 필요하면 살려놔도 돼.
  }
}
</style>