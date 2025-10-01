<script setup>
const props = defineProps({
  order: { type: Object, default: () => ({}) }
});
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
        <tr v-for="(menu, index) in order?.menuItems || []" :key="menu.menuId || index">
        <!-- <tr v-for="(menu, index) in selectedOrder?.menus || []" :key="menu.id || index" > -->
          <td>{{ menu.name ?? "--" }} </td>
          <td>
            <span v-if="menu.options?.length">
              {{ menu.options.flatMap(opt => [opt.comment, ...(opt.children?.map(c => c.comment) || [])]).join(', ') }}
            </span>
            <span v-else>--</span> 
          </td>
          <td>{{ menu.quantity }} </td>
          <td>{{ (menu.price * menu.quantity).toLocaleString() }}원</td>
          <!-- <td>{{ menu.name }}</td>
          <td>{{ menu.option || "--" }}</td>
          <td>{{ menu.quantity }}</td>
          <td>{{ menu.price.toLocaleString() }}원</td> -->
        </tr>
        <tr v-if="!order?.menuItems || order.menuItems.length === 0">
          <td colspan="4">--</td>
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
  display: block;
  max-height: 100px; // 👈 고정 높이 줘야 스크롤바 뜸
  overflow-y: auto;
  overflow-x: hidden;
}

  tr {
    display: table;       // tbody가 block이니까 tr은 table로
    width: 100%;
    table-layout: fixed;  // 컬럼 폭 고정
  }
}
</style>