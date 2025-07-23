<script setup>
const myAccount = [
  '주문내역조회',
  '정보수정',
  '결제관리',
  '즐겨찾기',
  '고객센터',
];
</script>

<template>
 <div class="accountBoard">
      <div>마이 페이지</div>
      <div>{{ myAccount[0] }}</div>
      <div>{{ myAccount[1] }}</div>
      <div>{{ myAccount[2] }}</div>
      <div>{{ myAccount[3] }}</div>
      <div>{{ myAccount[4] }}</div> 
    </div>
  </div>
</template>

<style scoped>

</style>