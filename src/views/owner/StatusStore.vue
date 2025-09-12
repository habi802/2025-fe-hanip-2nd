<script setup>
import { ref } from 'vue';

const selectedLang = ref('02'); // 기본값 02

const store = {
  ownerName : "홍길동",
  adds:"대구광역시 어디구 어디동 000길 234",
  addsadd:"503동 1380호 센트럴머시기APT"

}



</script>

<template>
  <form class="white-card">
    <div class="store-info-wrap1">
      <span>대표자 이름</span>
      <div class="gray-content">{{ store.ownerName }}</div>
      <span>가게 상호명</span>
      <div class="gray-content">{{ store.ownerName }}</div>
      <span>사업자등록번호</span>
      <div class="gray-content">{{ store.ownerName }}</div>
      <span>가게주소</span>
        <div class="address-box gray-content">
          {{ store.adds + store.addsadd  }}
        </div>
      <span>가게전화</span>
      <div class="d-flex">
        <select class="gray-content" name="lang" id="label" required>
          <option>02</option>
          <option>053</option>
          <option>010</option>
          <!-- 직접입력 선택 시 보여주고 아니면 숨기기 -->
          <option :v-bind="">직접입력<input v-if="selectedLang === '직접입력'" class="gray-content" placeholder="직접입력" /></option>

        </select>
        <input class="gray-content"></input>
        <input class="gray-content"></input>
      </div>
      <span>업종</span>
      <input class="gray-content"></input>
    </div>

    <div class="store-info-wrap2">
        <span>
          가게 대표 이미지
        </span>
        <button>이미지를 등록하세요</button>
        <input id="imgInput" type="file" accept="image/*" style="display:none" />
        <img id="imgPreview" src="" alt="미리보기 이미지" style="max-width: 300px; margin-top: 10px; display:none;" />
        <span>
          가게 소개글
        </span>
        <textarea placeholder="최대 200자 이하 짧은 홍보문구를 작성해보세요!">
        </textarea>
      </div>
  </form>

</template>


<style scoped lang="scss">
.white-card{
  display: flex;
  width: 95%;
  height: 90%;
  align-items: center;
  justify-content: center;
  gap: 50px;
}
.store-info-wrap1{
  display: grid;
  grid-template-columns: 100px 620px;
  align-items: center;
  gap: 20px;
}

.store-info-wrap2{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .address-box{
    display: flex;
    flex-direction: column;
  }
  button{
    width: 420px;
    height: 230px;
    border-radius: var(--card-lg-radius);
    border: none;
  }
  textarea{
    border-radius: var(--card-lg-radius);
    border: 1px solid var(--grey2);
  }
}

</style>