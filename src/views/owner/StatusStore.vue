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
  justify-content: center;
  align-items: center;
}

.btn-group {
  align-self: flex-start;
  margin-left: 5%; /* white-card가 width 95%니까 같은 위치에 맞추려면 */
}

</style>