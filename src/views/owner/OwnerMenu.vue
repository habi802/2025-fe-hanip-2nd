<script setup>
import MenuDetail from '@/components/owner/MenuDetail.vue';
import MenuList from '@/components/owner/MenuList.vue';



</script>

<template>
  <div class="d-flex">
    <div class="section-left">
      <MenuList/>
    </div>
    
    <div class="section-right">
      <MenuDetail/>
    </div>
  </div>

</template>

<style scoped lang="scss">
 .section-left{
    width: 50%;
    height: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 20px;
 }

.section-right{
    width: 50%;
    height: 100%;
    max-width: 800px;
    overflow: auto;
  }
</style>
