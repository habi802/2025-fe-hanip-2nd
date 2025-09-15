<script setup>
import { ref } from 'vue';
import StoreStatusStaticInfo from '@/components/owner/StoreStatusStaticInfo.vue';
import StoreStatusControl from '@/components/owner/StoreStatusControl.vue';

const selected = ref('basic'); // 기본으로 '기본정보'


</script>

<template>
  <div class="section-wrap">
    <div class="btn-group gap-3" role="group">
      <button type="button" class="submenu-btn"  :class="selected === 'basic' ? 'submenu-active' : 'submenu-none'"  @click="selected = 'basic'">
        기본정보
      </button>
      <button  type="button"  class="submenu-btn"  :class="selected === 'control' ? 'submenu-active' : 'submenu-none'" @click="selected = 'control'">
        운영관리
      </button>
    </div>

    <div class="white-card">
      <StoreStatusStaticInfo v-if="selected === 'basic'" />
      <StoreStatusControl v-if="selected === 'control'" />
      <div class="btn-wrap">
        <span>** 가게 정보 수정 시 내용을 꼭 확인해주세요.** </span>
        <div class="button-row">
          <button class="btn-cancle">취소</button>
          <button class="hn-btn-white">저장하기</button>
        </div>
      </div>
    </div>

  </div>
</template>


<style scoped lang="scss">
.section-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.white-card{
  width: 95%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.btn-group {
  align-self: flex-start;
  margin-left: 5%; /* white-card가 width 95%니까 같은 위치에 맞추려면 */
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