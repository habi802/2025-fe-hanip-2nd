<script setup>
//주문정보 :  고객명, 전화, 주소, 특이사항

</script>

<template>
  <div class="wrap">
    <section>
      <h3>주문 정보</h3>
      <table class="info-table">
        <tbody>
          <tr>
            <th>고객명</th>
            <td>selectedO </td>
            <!-- <td>{{ selectedOrder?.userName || "--" }}</td> -->
          </tr>
          <tr>
            <th>전화</th>
            <td> selectedOr</td>
            <!-- <td>{{ selectedOrder?.phone || "--" }}</td> -->
          </tr>
          <tr>
            <th>주소</th>
            <td> select </td>
            <!-- <td>{{ selectedOrder?.address || "--" }}</td> -->
          </tr>
          <tr>
            <th>특이사항</th>
            <td> selectedOr </td>
            <!-- <td>{{ selectedOrder?.storeRequest || "--" }}</td> -->
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/components/owner/orderInfo/orderInfoCommon.scss';

</style>