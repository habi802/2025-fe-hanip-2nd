<script setup>
import { computed } from 'vue';

//주문상태
const props = defineProps({
  order: { type: Object, default: () => ({}) }
});

const statusText = computed(() => {
  switch (props.order?.status) {
    case "ORDERED":
      return "주문완료";
    case "PREPARING":
      return "음식준비중";
    case "DELIVERING":
      return "배달중";
    case "COMPLETED":
      return "완료됨";
    case "CANCELED":
      return "취소됨";
    default:
      return "--";
  }
});

</script>

<template>
  <section>
    <h3>주문 현황</h3>
    <table class="menu-table">
      <thead>
        <tr>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ statusText }}</td>
          <!-- <td>{{ statusText }}</td> -->
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped lang="scss">
@import '@/components/owner/orderInfo/orderInfoCommon.scss';


</style>