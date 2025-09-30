<script setup>
import { computed } from 'vue';

const props = defineProps({
  order: { type: Object, default: () => ({}) }
});

const formatDateTime = (isoStr) => {
  return new Date(isoStr).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPayment = computed(() => {
  switch (props.order?.payment) {
    case "NAVER_PAY":
      return "네이버페이";
    case "KAKAO_PAY":
      return "카카오페이";
    default:
      return "--";
  }
})
</script>

<template>
  <section>
    <h3>결제 내역</h3>
    <table class="info-table">
      <tbody>
        <tr>
          <th>결제일시</th>
          <td>{{ formatDateTime(order?.createdAt) || "--" }}</td>
          <!-- <td>{{ formatDateTime(selectedOrder?.updated) || "--" }}</td> -->
        </tr>
        <tr>
          <th>결제수단</th>
          <td>{{ formatPayment || "--" }}</td>
          <!-- <td>{{ selectedOrder?.payment || "--" }}</td> -->
        </tr>
        <tr>
          <th>결제금액</th>
          <td>{{ order?.amount.toLocaleString() || "--" }}원</td>
          <!-- <td>{{ selectedOrder?.amount.toLocaleString() || "--" }}원</td> -->
        </tr>
        <tr>
          <th>할인내역</th>
          <td>--</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped lang="scss">
@import '@/components/owner/orderInfo/orderInfoCommon.scss';

</style>