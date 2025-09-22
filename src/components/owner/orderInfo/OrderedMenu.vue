<script setup>
//주문한 메뉴내역

</script>

<template>
  <section >
    <h3>주문 상세</h3>
    <table class="menu-table">
      <thead>
        <tr>
          <th>메뉴명</th>
          <th>옵션</th>
          <th>수량</th>
          <th>가격</th>
        </tr>
      </thead>
      <tbody class="scrollbar" >
        <tr>
        <!-- <tr v-for="(menu, index) in selectedOrder?.menus || []" :key="menu.id || index" > -->
          <td>menu.name </td>
          <td>menu.option || "--" </td>
          <td>menu.quantity </td>
          <td>100000원</td>
          <!-- <td>{{ menu.name }}</td>
          <td>{{ menu.option || "--" }}</td>
          <td>{{ menu.quantity }}</td>
          <td>{{ menu.price.toLocaleString() }}원</td> -->
        </tr>
        <tr v-for="n in 20" :key="n">
        <!-- <tr v-if="!selectedOrder?.menus || selectedOrder.menus.length === 0" > -->
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped lang="scss">
@import '@/components/owner/orderInfo/orderInfoCommon.scss';
section{
  height: 100%;
}
.menu-table {
  width: 100%;

  table{
  }
  thead {
    position: sticky;
    top: 0;           // 스크롤 시 상단 고정
    background: white; // 배경색 지정 안하면 투명으로 보여서 글씨 겹침
    z-index: 10; // 다른 내용보다 위로 
  }

  tbody {
    display: block;      // tbody를 블록으로 만들어서 스크롤 가능하게
    max-height: 100%; //42vh;  // 원하는 높이
    overflow-y: auto;    // 세로 스크롤
    overflow-x: hidden;
  }

  tr {
    display: table;       // tbody가 block이니까 tr은 table로
    width: 100%;
    table-layout: fixed;  // 컬럼 폭 고정
  }
}
</style>