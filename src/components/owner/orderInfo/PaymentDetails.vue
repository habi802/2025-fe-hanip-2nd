<script setup>
//결제내역 : 결제일시, 수단, 금액, 할인내역(아직안함)
</script>

<template>
  <section>
    <h3>결제 내역</h3>
    <table class="info-table">
      <tbody>
        <tr>
          <th>결제일시</th>
          <td>ㅇㅇㅇㅇ</td>
          <!-- <td>{{ formatDateTime(selectedOrder?.updated) || "--" }}</td> -->
        </tr>
        <tr>
          <th>결제수단</th>
          <td>ㅇㅇㅇㅇ</td>
          <!-- <td>{{ selectedOrder?.payment || "--" }}</td> -->
        </tr>
        <tr>
          <th>결제금액</th>
          <td>ㅇㅇㅇㅇ</td>
          <!-- <td>{{ selectedOrder?.amount.toLocaleString() || "--" }}원</td> -->
        </tr>
        <tr>
          <th>할인내역</th>
          <td>없음</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped lang="scss">
@import '@/components/owner/orderInfo/orderInfoCommon.scss';

</style>